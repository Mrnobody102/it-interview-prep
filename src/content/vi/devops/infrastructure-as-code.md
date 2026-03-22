# DevOps - Infrastructure as Code (Terraform & Ansible)

## 1. Infrastructure as Code la gi?

**Infrastructure as Code (IaC)** la phuong phap quan ly va cung cap ha tang thong qua cac file cau hinh co the doc duoc bang may (machine-readable), thay vi cac quy trinh thu cong. Đieu nay dam bao tinh nhat quan, co the lap lai va co kha nang quan ly phien ban cho ha tang.

### 1.1. Declarative vs Imperative

| Phuong phap | Declarative (Khai bao) | Imperative (Lenh) |
|-------------|------------------------|-------------------|
| **Dinh nghia** | Dinh nghia trang thai cuoi cung mong muon | Dinh nghia cac buoc lenh tuyen tinh |
| **Vi du** | "Toi muon 3 server dang chay" | "Tao server 1, roi server 2, roi server 3" |
| **Cong cu** | Terraform, CloudFormation | Ansible (lam duoc ca 2), Bash scripts |
| **Hanh vi** | Tinh ra cach dat duoc trang thai mong muon | Thuc thi cac lenh duoc dinh san |
| **Idempotency** | Tich hop san | Phai thiet ke tuong minh |

### 1.2. Loi ich cua IaC

- **Version control** — Thay doi ha tang duoc theo doi trong Git
- **Tinh nhat quan** — Cung cau hinh tao ra moi truong giong nhau
- **Tu dong hoa** — Khong co buoc cung cap thu cong
- **Kha nang tai su dung** — Modules va templates cho cac mau co the lap lai
- **Kha nang kiem toan** — Moi thay doi duoc ghi nhan va xem lai
- **Toc do** — Cung cap ha tang trong vong phut thay vi ngay

---

## 2. Terraform

**Terraform** cua HashiCorp la mot cong cu IaC khai bao su dung ngon ngu rieng (HCL — HashiCorp Configuration Language) de dinh nghia va cung cap ha tang tren nhieu cloud providers khac nhau.

### 2.1. Cac khai niem co ban

```hcl
# provider dinh nghia cloud/platform nao de su dung
provider "aws" {
  region = "us-east-1"
}

# resource la mot doi tuong ha tang
resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"

  tags = {
    Name        = "web-server"
    Environment = "production"
  }
}
```

### 2.2. Cac file Terraform

| File | Muc dich |
|------|---------|
| `main.tf` | Cau hinh chinh (resources, data sources) |
| `variables.tf` | Dinh nghia cac bien dau vao |
| `outputs.tf` | Dinh nghia cac gia tri dau ra |
| `terraform.tfvars` | Gia tri bien (khong nen version-control secrets) |
| `*.tf` files | Bat ky file `.tf` nao deu duoc parse |

### 2.3. Variables & Outputs

```hcl
# variables.tf
variable "environment" {
  description = "Moi truong trien khai"
  type        = string
  default     = "dev"
}

variable "instance_config" {
  description = "Cau hinh EC2 instance"
  type = object({
    ami           = string
    instance_type = string
    volume_size   = number
  })
  default = {
    ami           = "ami-0c55b159cbfafe1f0"
    instance_type = "t3.medium"
    volume_size   = 20
  }
}

variable "tags" {
  description = "Tags cho resource"
  type        = map(string)
  default     = {}
}
```

```hcl
# outputs.tf
output "instance_public_ip" {
  description = "Public IP cua web server"
  value       = aws_instance.web_server.public_ip
}

output "instance_private_ip" {
  description = "Private IP cua web server"
  value       = aws_instance.web_server.private_ip
}

output "instance_id" {
  description = "ID cua EC2 instance"
  value       = aws_instance.web_server.id
  sensitive   = true  # An khoi CLI output
}
```

### 2.4. Data Sources

```hcl
# Lay thong tin VPC hien co
data "aws_vpc" "main" {
  id = "vpc-0123456789abcdef0"
}

# Lay Ubuntu AMI moi nhat
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Tham chieu gia tri tu data source
resource "aws_instance" "server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.medium"
  vpc_security_group_ids = [aws_security_group.web.id]
  subnet_id     = data.aws_vpc.main.subnets[0].id
}
```

### 2.5. Quan ly State

Terraform luu trang thai cua ha tang duoc quan ly trong mot **state file**. Day la dieu rat quan trong de hieu da co gi va lap ke hoach thay doi.

```hcl
# Local state (mac dinh, KHONG cho teams)
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}

# Remote state voi S3 + DynamoDB (khuyen nghi cho teams)
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

> **Quan trong:** Tuyet doi khong commit `terraform.tfstate` vao version control, dac biet neu no chua du lieu nhay cam. Su dung remote backends voi state encryption.

### 2.6. Workspaces

```bash
# Tao va chuyen doi workspaces
terraform workspace new prod
terraform workspace new staging
terraform workspace select prod

# Danh sach workspaces
terraform workspace list

# Su dung workspace trong cau hinh
output "env_name" {
  value = terraform.workspace
}

resource "aws_instance" "server" {
  tags = {
    Name = "${terraform.workspace}-server"
  }
}
```

### 2.7. Modules

```hcl
# modules/networking/vpc/main.tf
variable "cidr_block" {
  type = string
}

variable "environment" {
  type = string
}

resource "aws_vpc" "main" {
  cidr_block = var.cidr_block
  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

output "vpc_id" {
  value = aws_vpc.main.id
}
```

```hcl
# main.tf — su dung module
module "vpc" {
  source = "./modules/networking/vpc"

  cidr_block  = "10.0.0.0/16"
  environment = "production"
}
```

### 2.8. Cac lenh Terraform

```bash
# Khoi tao (tai providers, thiet lap backend)
terraform init

# Validate cau hinh
terraform validate

# Format cau hinh
terraform fmt

# Hien thi se duoc tao ra gi
terraform plan
terraform plan -var-file="prod.tfvars"
terraform plan -out=plan.tfplan     # Luu plan vao file

# Ap dung thay doi
terraform apply
terraform apply plan.tfplan        # Ap dung plan da luu
terraform apply -auto-approve       # Bo qua xac nhan
terraform apply -var="environment=prod"

# Xoa toan bo resources
terraform destroy
terraform destroy -target=aws_instance.web_server  # Xoa resource cu the

# Import ha tang hien co
terraform import aws_instance.existing i-0123456789abcdef0

# Quan ly state
terraform state list                    # Danh sach resources trong state
terraform state show aws_instance.web  # Hien thi chi tiet resource
terraform state mv aws_instance.old aws_instance.new  # Doi ten
terraform state rm aws_instance.old   # Xoa khoi state
terraform state pull                  # Pull remote state ve local
terraform state push                  # Push local state len remote

# Refresh state (dong bo voi ha tang thuc)
terraform refresh
```

### 2.9. Terraform vs Pulumi vs CloudFormation

| Tinh nang | Terraform | Pulumi | CloudFormation |
|-----------|-----------|--------|----------------|
| **Ngon ngu** | HCL (tu dinh nghia) | Dong (TypeScript, Python, Go...) | YAML/JSON |
| **State management** | External state file | External state file | Quan ly boi AWS |
| **Multi-cloud** | Native (providers cho tat ca clouds) | Native (tat ca cloud SDKs) | Chi AWS (co cross-stack references) |
| **Learning curve** | HCL de hoc nhung han che logic | Can kien thuc lap trinh | Khai bao nhung dai |
| **Testing** | Terratest, Checkov | Standard testing frameworks | CloudFormation guards |
| **Drift detection** | Tich hop san | Tich hop san | Tich hop san |
| **Plan/Apply** | Hai buoc | Hai buoc | Truc tiep (khong co plan phase) |
| **Approval workflow** | Co | Co | Co (Change Sets) |

---

## 3. Ansible

**Ansible** la mot cong cu automation agentless su dung SSH (hoac WinRM cho Windows) de thuc thi cac tasks tren cac host từ xa. No ho tro ca **imperative** (task-based) va **declarative** (playbook-based).

### 3.1. Cac khai niem chinh

| Khoi niem | Mo ta |
|-----------|-------|
| **Inventory** | Danh sach cac hosts va groups de quan ly |
| **Playbook** | File YAML dinh nghia mot tap hop cac plays (cau hinh) |
| **Play** | Mot tap hop tasks chay tren mot nhom hosts |
| **Task** | Mot hanh dong don le de thuc hien (apt, copy, service...) |
| **Handler** | Task chi chay khi duoc thong bao boi cac tasks khac |
| **Role** | Tap hop co the tai su dung gom tasks, handlers, templates, variables |
| **Module** | Don vi cong viec tich hop san hoac tu dinh nghia (apt, yum, copy...) |
| **Fact** | Thong tin he thong duoc Ansible thu thap truoc khi thuc thi |

### 3.2. Inventory

```ini
# inventory/hosts.ini
# Inventory don gian
[webservers]
web1.example.com
web2.example.com
web3.example.com

[dbservers]
db1.example.com
db2.example.com

[production:children]
webservers
dbservers

[production:vars]
ansible_user=deploy
ansible_port=22
http_port=80
environment=production
```

```yaml
# inventory/inventory.yml (dinh dang YAML)
all:
  children:
    webservers:
      hosts:
        web1.example.com:
          http_port: 80
        web2.example.com:
          http_port: 8080
    dbservers:
      hosts:
        db1.example.com:
          db_port: 5432
        db2.example.com:
          db_port: 5432
  vars:
    ansible_user: deploy
    ansible_python_interpreter: /usr/bin/python3
```

### 3.3. Playbooks

```yaml
# playbook.yml
---
- name: Deploy web application
  hosts: webservers
  become: yes                    # Chay voi sudo
  vars:
    app_version: "1.2.3"
    app_directory: /opt/myapp

  tasks:
    - name: Cai dat cac goi yeu cau
      apt:
        name:
          - nginx
          - curl
          - git
        state: present
        update_cache: yes

    - name: Tao thu muc ung dung
      file:
        path: "{{ app_directory }}"
        state: directory
        owner: deploy
        group: deploy
        mode: '0755'

    - name: Clone repository cua ung dung
      git:
        repo: "https://github.com/myorg/myapp.git"
        dest: "{{ app_directory }}"
        version: "v{{ app_version }}"
        force: yes
      notify: Restart nginx

    - name: Tao cau hinh nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/sites-available/myapp.conf
        mode: '0644'
      notify: Enable nginx site

    - name: Dam bao nginx dang chay
      service:
        name: nginx
        state: started
        enabled: yes

    - name: Chay database migrations
      command: npm run migrate
      args:
        chdir: "{{ app_directory }}"
      when: ansible_facts['os_family'] == "Debian"

  handlers:
    - name: Restart nginx
      service:
        name: nginx
        state: restarted

    - name: Enable nginx site
      file:
        src: /etc/nginx/sites-available/myapp.conf
        dest: /etc/nginx/sites-enabled/myapp.conf
        state: link
      notify: Restart nginx
```

### 3.4. Cac Ansible Modules

```yaml
# Quan ly goi
- name: Cai dat nginx (Debian/Ubuntu)
  apt:
    name: nginx
    state: present
    update_cache: yes

- name: Cai dat httpd (RHEL/CentOS)
  yum:
    name: httpd
    state: present

# Quan ly service
- name: Bat dau va enable nginx
  service:
    name: nginx
    state: started
    enabled: yes

# Thao tac file
- name: Tao mot thu muc
  file:
    path: /opt/myapp
    state: directory
    mode: '0755'
    owner: deploy
    group: deploy

- name: Copy file len server
  copy:
    src: ./config/app.conf
    dest: /etc/myapp/app.conf
    owner: root
    group: root
    mode: '0644'
    backup: yes                    # Backup file hien co

# Thao tac Template (dung Jinja2)
- name: Render template
  template:
    src: config.j2
    dest: /etc/myapp/config.conf
    mode: '0644'
  vars:
    db_host: "{{ hostvars['db1.example.com']['ansible_host'] | default('localhost') }}"

# Thuc thi lenh
- name: Chay mot shell command
  command: /opt/scripts/deploy.sh
  args:
    creates: /opt/myapp/.deployed   # Bo qua neu file nay ton tai (idempotent)
  register: deploy_output

- name: Hien thi dau ra command
  debug:
    msg: "{{ deploy_output.stdout }}"

# Cai dat package voi pip
- name: Cai dat Python packages
  pip:
    name:
      - flask
      - gunicorn
    state: present
    virtualenv: /opt/venv
    virtualenv_command: python3 -m venv

# Thao tac Docker
- name: Build va chay Docker container
  docker_container:
    name: myapp
    image: "myorg/myapp:latest"
    state: started
    ports:
      - "8080:8080"
    env:
      NODE_ENV: production
    restart_policy: always
    pull: yes

# Quan ly user
- name: Tao deploy user
  user:
    name: deploy
    groups: docker
    shell: /bin/bash
    generate_ssh_key: yes
```

### 3.5. Roles

```text
roles/
└── myapp/
    ├── defaults/
    │   └── main.yml         # Bien mac dinh (uu tien thap nhat)
    ├── files/               # File tinh (copy truc tiep)
    │   └── app.conf
    ├── handlers/
    │   └── main.yml         # Handlers
    ├── meta/
    │   └── main.yml         # Metadata va dependencies cua role
    ├── tasks/
    │   └── main.yml         # Danh sach task chinh
    ├── templates/
    │   └── nginx.conf.j2   # Jinja2 templates
    └── vars/
        └── main.yml         # Variables (uu tien cao hon)
```

```yaml
# roles/myapp/tasks/main.yml
- name: Include OS-specific variables
  include_vars: "{{ ansible_facts['os_family'] | lower }}.yml"

- name: Cai dat packages
  package:
    name: "{{ packages }}"
    state: present

- name: Deploy ung dung
  include_role:
    name: myapp.deploy

- name: Cau hinh ung dung
  template:
    src: app.conf.j2
    dest: /etc/myapp/app.conf
  notify: Restart app
```

### 3.6. Idempotency trong Ansible

Ansible duoc thiet ke de **idempotent** — chay cung playbook nhieu lan tao ra ket qua giong nhau. Cac nguyen tac chinh:

> **Idempotent** nghia la: ap dung cau hinh N lan tao ra ket qua giong nhu chi ap dung mot lan.

- Dung `state: present` thay vi kiem tra va cai dat thu cong
- Dung `creates` tren `command` de bo qua neu da lam roi
- Dung `notify` / `handlers` thay vi chay hanh dong moi lan chay
- Dung `changed_when` de kiem soat khi nao Ansible cho ra ket qua "changed"
- Dung `check_mode` de kiem tra ma khong thay doi

```yaml
# Vi du Idempotent
- name: Dam bao nginx da cai dat
  apt:
    name: nginx
    state: present           # Idempotent — chi cai dat neu chua co

- name: Tao file
  file:
    path: /tmp/test.txt
    state: touch
    mode: '0644'
  # Idempotent — touching file da ton tai khong thay doi gi

- name: Chay migration script
  command: npm run migrate
  args:
    creates: /opt/myapp/.migrated  # Bo qua neu file nay ton tai
  changed_when: false               # Luon coi la "ok", khong phai "changed"
```

### 3.7. Cac lenh Ansible

```bash
# Inventory va kiem tra ket noi
ansible all -i inventory/hosts.ini -m ping
ansible all -i inventory/hosts.ini -m command -a "uptime"
ansible all -i inventory/hosts.ini -m setup          # Thu thap facts

# Chay mot playbook
ansible-playbook -i inventory/hosts.ini playbook.yml
ansible-playbook -i inventory/hosts.ini playbook.yml --tags deploy
ansible-playbook -i inventory/hosts.ini playbook.yml --skip-tags database
ansible-playbook -i inventory/hosts.ini playbook.yml --check       # Dry-run
ansible-playbook -i inventory/hosts.ini playbook.yml --syntax-check

# Gioi han chi chay tren hosts cu the
ansible-playbook -i inventory/hosts.ini playbook.yml --limit webservers

# Chay tung buoc
ansible-playbook -i inventory/hosts.ini playbook.yml --step

# Truyen bien them
ansible-playbook -i inventory/hosts.ini playbook.yml -e "app_version=1.2.3"

# Vault cho secrets
ansible-vault encrypt secrets.yml
ansible-vault decrypt secrets.yml
ansible-vault edit secrets.yml
ansible-playbook playbook.yml --ask-vault-pass
ansible-playbook playbook.yml --vault-password-file ~/.vault_pass.txt
```

### 3.8. So sanh Ansible vs Terraform

| Tieu chi | Terraform | Ansible |
|----------|-----------|---------|
| **Phuong phap** | Declarative (trang thai mong muon) | Imperative + Declarative |
| **Model thuc thi** | Lap ke hoach roi ap dung | Push lenh qua SSH |
| **State** | Theo doi state trong state file | Stateless (khong co state file) |
| **Provisioners** | Tich hop san (local-exec, remote-exec) | Lenh SSH nguyen thuy |
| **Tot nhat cho** | Cung cap ha tang | Quan ly cau hinh, trien khai ung dung |
| **Idempotency** | Tich hop san (declarative) | Co thiet ke (nhung can chu y) |
| **Agentless** | Co | Co |
| **Learning curve** | HCL don gian | YAML don gian nhung playbook co the phuc tap |
| **Testing** | Terratest | Ansible Molecule |
| **Xu ly secrets** | Tich hop Vault | Ansible Vault |
| **Orchestration** | Han che (cross-cloud) | Manh (orchestrates bat cu gi qua SSH) |

---

## 4. Cau hoi phong van

**Q: Khac biet chinh giua Terraform va Ansible?**

> Terraform chu yeu la **declarative** va tập trung vào **cung cap ha tang** — no quan ly vong doi cua cac cloud resources. Ansible thi **imperative** hon va xuat sac trong **quan ly cau hinh** va **trien khai ung dung** — no chay cac tasks tren cac server da ton tai. Nhieu team su dung ca hai: Terraform de cung cap ha tang, Ansible de cau hinh no.

**Q: Terraform quan ly state nhu the nao, tai sao no quan trong?**

> Terraform luu trang thai cua cac resources duoc quan ly trong mot state file. No su dung state nay de map cac resources thuc te voi cau hinh, theo doi dependencies, va lap ke hoach thay doi. State nen duoc luu tru tu xa (S3 voi DynamoDB locking) trong moi truong lam viec nhom de dam bao tinh nhat quan va ngan chan cac thay doi dong thoi.

**Q: Idempotency la gi, va Ansible dat duoc no nhu the nao?**

> Idempotency nghia la chay cau hinh nhieu lan tao ra ket qua giong nhu chi chay mot lan. Ansible dat duoc dieu nay thong qua cac modules kiem tra trang thai hien tai va chi thay doi neu can (vi du: `apt` voi `state: present`). Ban nen tranh cac modules `command` hoac `shell` thuan tuy ma khong co cac bien phap idempotency nhu `creates`, `when`, hoac `changed_when`.

**Q: Terraform "plan" phase la gi?**

> Thao tac hai buoc (plan va apply) cua Terraform cho phep ban xem lai thay doi truoc khi ap dung. Plan phase so sanh trang thai mong muon (cau hinh) voi trang thai hien tai (state file + ha tang thuc) va tao ra mot ke hoach thuc thi cho thay duoc tao, sua doi, hoac xoa gi. Đieu nay tao ra mot mang lưới an toàn truoc khi thay doi ha tang.

**Q: Lam the nao de quan ly secrets trong IaC?**

> Tuyet doi khong commit secrets vao version control. Su dung:
> - **Terraform:** `sensitive = true` cho output, encrypted remote state, va secrets trong Vault hoac AWS Secrets Manager qua providers.
> - **Ansible:** Ansible Vault de ma hoa files, hoac external secrets managers.
> - **Ca hai:** Environment variables, `.gitignore` cac file nhay cam, va CI/CD secret injection.

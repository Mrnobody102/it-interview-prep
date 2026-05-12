# DevOps - Infrastructure as Code (Terraform & Ansible)

## 1. Infrastructure as Code là gì?

**Infrastructure as Code (IaC)** là cách mô tả hạ tầng bằng file cấu hình/code thay vì bấm tay trên cloud console. Hạ tầng ở đây gồm server, network, database, load balancer, Kubernetes resources, IAM, DNS...

Ý chính: thay vì "nhớ đã cấu hình gì", team giữ cấu hình trong Git. Khi cần tạo môi trường mới, chạy tool để dựng lại hạ tầng giống nhau.

### 1.1. Declarative vs Imperative

| Phương pháp | Declarative (Khai báo) | Imperative (Mệnh lệnh) |
|-------------|------------------------|-------------------|
| **Định nghĩa** | Mô tả trạng thái cuối cùng mong muốn | Mô tả từng bước phải chạy |
| **Ví dụ** | "Tôi muốn 3 server đang chạy" | "Tạo server 1, rồi server 2, rồi server 3" |
| **Công cụ** | Terraform, CloudFormation | Ansible, Bash scripts |
| **Hành vi** | Tool tự tính cần tạo/sửa/xóa gì | Chạy theo thứ tự lệnh đã viết |
| **Idempotency** | Thường có sẵn | Phải thiết kế cẩn thận |

**Idempotency** nghĩa là chạy cùng cấu hình nhiều lần vẫn ra cùng kết quả, không tạo trùng lung tung.

### 1.2. Lợi ích của IaC

- **Version control:** thay đổi hạ tầng được review và lưu trong Git.
- **Nhất quán:** cùng cấu hình tạo ra môi trường giống nhau.
- **Tự động hóa:** giảm thao tác thủ công dễ sai.
- **Tái sử dụng:** module/template dùng lại cho nhiều môi trường.
- **Audit:** biết ai đổi gì, đổi lúc nào.
- **Tốc độ:** dựng hạ tầng trong vài phút thay vì làm tay nhiều giờ.

---

## 2. Terraform

**Terraform** là công cụ IaC dạng khai báo. Bạn viết file HCL để mô tả cloud resources cần có, Terraform so sánh với state hiện tại rồi tạo/sửa/xóa phần cần thiết.

### 2.1. Các khái niệm cơ bản

```hcl
# provider định nghĩa cloud/platform nào sẽ dùng
provider "aws" {
  region = "us-east-1"
}

# resource là một đối tượng hạ tầng
resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"

  tags = {
    Name        = "web-server"
    Environment = "production"
  }
}
```

### 2.2. Các file Terraform

| File | Mục đích |
|------|---------|
| `main.tf` | Cấu hình chính: resources, data sources |
| `variables.tf` | Định nghĩa biến đầu vào |
| `outputs.tf` | Định nghĩa giá trị đầu ra |
| `terraform.tfvars` | Giá trị biến, không nên lưu secrets |
| `*.tf` files | Terraform sẽ đọc mọi file `.tf` trong thư mục |

### 2.3. Variables & Outputs

```hcl
# variables.tf
variable "environment" {
  description = "Môi trường triển khai"
  type        = string
  default     = "dev"
}

variable "instance_config" {
  description = "Cấu hình EC2 instance"
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
  description = "Public IP của web server"
  value       = aws_instance.web_server.public_ip
}

output "instance_private_ip" {
  description = "Private IP của web server"
  value       = aws_instance.web_server.private_ip
}

output "instance_id" {
  description = "ID của EC2 instance"
  value       = aws_instance.web_server.id
  sensitive   = true  # Ẩn khỏi CLI output
}
```

### 2.4. Data Sources

```hcl
# Lấy thông tin VPC hiện có
data "aws_vpc" "main" {
  id = "vpc-0123456789abcdef0"
}

# Lấy Ubuntu AMI mới nhất
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Tham chiếu giá trị từ data source
resource "aws_instance" "server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.medium"
  vpc_security_group_ids = [aws_security_group.web.id]
  subnet_id     = data.aws_vpc.main.subnets[0].id
}
```

### 2.5. Quản lý State

Terraform lưu trạng thái của hạ tầng được quản lý trong một **state file**. Đây là phần rất quan trọng để biết hiện có gì và lập kế hoạch thay đổi.

```hcl
# Local state (mặc định, KHÔNG phù hợp cho team)
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}

# Remote state với S3 + DynamoDB (khuyến nghị cho team)
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

> **Quan trọng:** Tuyệt đối không commit `terraform.tfstate` vào version control, đặc biệt nếu nó chứa dữ liệu nhạy cảm. Dùng remote backend với mã hóa state.

### 2.6. Workspaces

```bash
# Tạo và chuyển đổi workspaces
terraform workspace new prod
terraform workspace new staging
terraform workspace select prod

# Danh sách workspaces
terraform workspace list

# Dùng workspace trong cấu hình
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
# main.tf — sử dụng module
module "vpc" {
  source = "./modules/networking/vpc"

  cidr_block  = "10.0.0.0/16"
  environment = "production"
}
```

### 2.8. Các lệnh Terraform

```bash
# Khởi tạo (tải providers, thiết lập backend)
terraform init

# Validate cấu hình
terraform validate

# Format cấu hình
terraform fmt

# Hiển thị sẽ được tạo ra gì
terraform plan
terraform plan -var-file="prod.tfvars"
terraform plan -out=plan.tfplan     # Lưu plan vào file

# Áp dụng thay đổi
terraform apply
terraform apply plan.tfplan        # Áp dụng plan đã lưu
terraform apply -auto-approve       # Bỏ qua xác nhận
terraform apply -var="environment=prod"

# Xóa toàn bộ resources
terraform destroy
terraform destroy -target=aws_instance.web_server  # Xóa resource cụ thể

# Import hạ tầng hiện có
terraform import aws_instance.existing i-0123456789abcdef0

# Quản lý state
terraform state list                    # Danh sách resources trong state
terraform state show aws_instance.web  # Hiển thị chi tiết resource
terraform state mv aws_instance.old aws_instance.new  # Đổi tên
terraform state rm aws_instance.old   # Xóa khỏi state
terraform state pull                  # Pull remote state về local
terraform state push                  # Push local state lên remote

# Refresh state (đồng bộ với hạ tầng thực)
terraform refresh
```

### 2.9. Terraform vs Pulumi vs CloudFormation

| Tính năng | Terraform | Pulumi | CloudFormation |
|-----------|-----------|--------|----------------|
| **Ngôn ngữ** | HCL (tự định nghĩa) | Động (TypeScript, Python, Go...) | YAML/JSON |
| **State management** | External state file | External state file | Quản lý bởi AWS |
| **Multi-cloud** | Native (providers cho tất cả cloud) | Native (tất cả cloud SDKs) | Chỉ AWS (có cross-stack references) |
| **Learning curve** | HCL dễ học nhưng hạn chế logic | Cần kiến thức lập trình | Khai báo nhưng dài |
| **Testing** | Terratest, Checkov | Standard testing frameworks | CloudFormation Guards |
| **Drift detection** | Tích hợp sẵn | Tích hợp sẵn | Tích hợp sẵn |
| **Plan/Apply** | Hai bước | Hai bước | Trực tiếp (không có plan phase) |
| **Approval workflow** | Có | Có | Có (Change Sets) |

---

## 3. Ansible

**Ansible** là công cụ automation agentless dùng SSH (hoặc WinRM cho Windows) để thực thi task trên host từ xa. Nó hỗ trợ cả **imperative** (task-based) và **declarative** (playbook-based).

### 3.1. Các khái niệm chính

| Khái niệm | Mô tả |
|-----------|-------|
| **Inventory** | Danh sách hosts và groups để quản lý |
| **Playbook** | File YAML định nghĩa một tập hợp plays (cấu hình) |
| **Play** | Một tập hợp task chạy trên một nhóm hosts |
| **Task** | Một hành động đơn lẻ để thực hiện (apt, copy, service...) |
| **Handler** | Task chỉ chạy khi được thông báo bởi task khác |
| **Role** | Tập hợp có thể tái sử dụng gồm tasks, handlers, templates, variables |
| **Module** | Đơn vị công việc tích hợp sẵn hoặc tự định nghĩa (apt, yum, copy...) |
| **Fact** | Thông tin hệ thống được Ansible thu thập trước khi thực thi |

### 3.2. Inventory

```ini
# inventory/hosts.ini
# Inventory đơn giản
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
# inventory/inventory.yml (định dạng YAML)
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
  become: yes                    # Chạy với sudo
  vars:
    app_version: "1.2.3"
    app_directory: /opt/myapp

  tasks:
    - name: Cài đặt các gói yêu cầu
      apt:
        name:
          - nginx
          - curl
          - git
        state: present
        update_cache: yes

    - name: Tạo thư mục ứng dụng
      file:
        path: "{{ app_directory }}"
        state: directory
        owner: deploy
        group: deploy
        mode: '0755'

    - name: Clone repository của ứng dụng
      git:
        repo: "https://github.com/myorg/myapp.git"
        dest: "{{ app_directory }}"
        version: "v{{ app_version }}"
        force: yes
      notify: Restart nginx

    - name: Tạo cấu hình nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/sites-available/myapp.conf
        mode: '0644'
      notify: Enable nginx site

    - name: Đảm bảo nginx đang chạy
      service:
        name: nginx
        state: started
        enabled: yes

    - name: Chạy database migrations
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

### 3.4. Các Ansible module

```yaml
# Quản lý gói
- name: Cài đặt nginx (Debian/Ubuntu)
  apt:
    name: nginx
    state: present
    update_cache: yes

- name: Cài đặt httpd (RHEL/CentOS)
  yum:
    name: httpd
    state: present

# Quản lý service
- name: Bắt đầu và enable nginx
  service:
    name: nginx
    state: started
    enabled: yes

# Thao tác file
- name: Tạo một thư mục
  file:
    path: /opt/myapp
    state: directory
    mode: '0755'
    owner: deploy
    group: deploy

- name: Copy file lên server
  copy:
    src: ./config/app.conf
    dest: /etc/myapp/app.conf
    owner: root
    group: root
    mode: '0644'
    backup: yes                    # Backup file hiện có

# Thao tác template (dùng Jinja2)
- name: Render template
  template:
    src: config.j2
    dest: /etc/myapp/config.conf
    mode: '0644'
  vars:
    db_host: "{{ hostvars['db1.example.com']['ansible_host'] | default('localhost') }}"

# Thực thi lệnh
- name: Chạy một shell command
  command: /opt/scripts/deploy.sh
  args:
    creates: /opt/myapp/.deployed   # Bỏ qua nếu file này tồn tại (idempotent)
  register: deploy_output

- name: Hiển thị đầu ra command
  debug:
    msg: "{{ deploy_output.stdout }}"

# Cài đặt package với pip
- name: Cài đặt Python packages
  pip:
    name:
      - flask
      - gunicorn
    state: present
    virtualenv: /opt/venv
    virtualenv_command: python3 -m venv

# Thao tác Docker
- name: Build và chạy Docker container
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

# Quản lý user
- name: Tạo deploy user
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
    │   └── main.yml         # Biến mặc định (ưu tiên thấp nhất)
    ├── files/               # File tĩnh (copy trực tiếp)
    │   └── app.conf
    ├── handlers/
    │   └── main.yml         # Handlers
    ├── meta/
    │   └── main.yml         # Metadata và dependencies của role
    ├── tasks/
    │   └── main.yml         # Danh sách task chính
    ├── templates/
    │   └── nginx.conf.j2   # Jinja2 template
    └── vars/
        └── main.yml         # Variables (ưu tiên cao hơn)
```

```yaml
# roles/myapp/tasks/main.yml
- name: Include OS-specific variables
  include_vars: "{{ ansible_facts['os_family'] | lower }}.yml"

- name: Cài đặt packages
  package:
    name: "{{ packages }}"
    state: present

- name: Deploy ứng dụng
  include_role:
    name: myapp.deploy

- name: Cấu hình ứng dụng
  template:
    src: app.conf.j2
    dest: /etc/myapp/app.conf
  notify: Restart app
```

### 3.6. Idempotency trong Ansible

Ansible được thiết kế để **idempotent** — chạy cùng playbook nhiều lần vẫn cho kết quả giống nhau. Các nguyên tắc chính:

> **Idempotent** nghĩa là: áp dụng cấu hình N lần cho ra kết quả giống như chỉ áp dụng một lần.

- Dùng `state: present` thay vì kiểm tra và cài đặt thủ công
- Dùng `creates` trên `command` để bỏ qua nếu đã làm rồi
- Dùng `notify` / `handlers` thay vì chạy hành động mỗi lần
- Dùng `changed_when` để kiểm soát khi nào Ansible báo kết quả "changed"
- Dùng `check_mode` để kiểm tra mà không thay đổi

```yaml
# Ví dụ idempotent
- name: Đảm bảo nginx đã cài đặt
  apt:
    name: nginx
    state: present           # Idempotent — chỉ cài đặt nếu chưa có

- name: Tạo file
  file:
    path: /tmp/test.txt
    state: touch
    mode: '0644'
  # Idempotent — touch file đã tồn tại không thay đổi gì

- name: Chạy migration script
  command: npm run migrate
  args:
    creates: /opt/myapp/.migrated  # Bỏ qua nếu file này tồn tại
  changed_when: false               # Luôn coi là "ok", không phải "changed"
```

### 3.7. Các lệnh Ansible

```bash
# Inventory và kiểm tra kết nối
ansible all -i inventory/hosts.ini -m ping
ansible all -i inventory/hosts.ini -m command -a "uptime"
ansible all -i inventory/hosts.ini -m setup          # Thu thập facts

# Chạy một playbook
ansible-playbook -i inventory/hosts.ini playbook.yml
ansible-playbook -i inventory/hosts.ini playbook.yml --tags deploy
ansible-playbook -i inventory/hosts.ini playbook.yml --skip-tags database
ansible-playbook -i inventory/hosts.ini playbook.yml --check       # Dry-run
ansible-playbook -i inventory/hosts.ini playbook.yml --syntax-check

# Giới hạn chỉ chạy trên hosts cụ thể
ansible-playbook -i inventory/hosts.ini playbook.yml --limit webservers

# Chạy từng bước
ansible-playbook -i inventory/hosts.ini playbook.yml --step

# Truyền biến thêm
ansible-playbook -i inventory/hosts.ini playbook.yml -e "app_version=1.2.3"

# Vault cho secrets
ansible-vault encrypt secrets.yml
ansible-vault decrypt secrets.yml
ansible-vault edit secrets.yml
ansible-playbook playbook.yml --ask-vault-pass
ansible-playbook playbook.yml --vault-password-file ~/.vault_pass.txt
```

### 3.8. So sánh Ansible vs Terraform

| Tiêu chí | Terraform | Ansible |
|----------|-----------|---------|
| **Phương pháp** | Declarative (trạng thái mong muốn) | Imperative + Declarative |
| **Model thực thi** | Lập kế hoạch rồi áp dụng | Push lệnh qua SSH |
| **State** | Theo dõi state trong state file | Stateless (không có state file) |
| **Provisioners** | Tích hợp sẵn (local-exec, remote-exec) | Lệnh SSH nguyên thủy |
| **Tốt nhất cho** | Cung cấp hạ tầng | Quản lý cấu hình, triển khai ứng dụng |
| **Idempotency** | Tích hợp sẵn (declarative) | Có thiết kế (nhưng cần chú ý) |
| **Agentless** | Có | Có |
| **Learning curve** | HCL đơn giản | YAML đơn giản nhưng playbook có thể phức tạp |
| **Testing** | Terratest | Ansible Molecule |
| **Xử lý secrets** | Tích hợp Vault | Ansible Vault |
| **Orchestration** | Hạn chế (cross-cloud) | Mạnh (orchestrates bất cứ gì qua SSH) |

---

## 4. Câu hỏi phỏng vấn

**Q: Khác biệt chính giữa Terraform và Ansible?**

> Terraform chủ yếu là **declarative** và tập trung vào **cung cấp hạ tầng** — nó quản lý vòng đời của cloud resources. Ansible thiên về **imperative** hơn và rất mạnh ở **quản lý cấu hình** và **triển khai ứng dụng** — nó chạy task trên server đã tồn tại. Nhiều team dùng cả hai: Terraform để cung cấp hạ tầng, Ansible để cấu hình nó.

**Q: Terraform quản lý state như thế nào, tại sao nó quan trọng?**

> Terraform lưu trạng thái của các resource được quản lý trong một state file. Nó dùng state này để map resource thực tế với cấu hình, theo dõi dependencies, và lập kế hoạch thay đổi. State nên được lưu trữ từ xa (S3 với DynamoDB locking) trong môi trường làm việc nhóm để đảm bảo nhất quán và ngăn thay đổi đồng thời.

**Q: Idempotency là gì, và Ansible đạt được nó như thế nào?**

> Idempotency nghĩa là chạy cấu hình nhiều lần vẫn cho kết quả giống như chỉ chạy một lần. Ansible đạt được điều này qua các module kiểm tra trạng thái hiện tại và chỉ thay đổi khi cần (ví dụ: `apt` với `state: present`). Nên tránh module `command` hoặc `shell` thuần túy nếu không có biện pháp idempotency như `creates`, `when`, hoặc `changed_when`.

**Q: Terraform "plan" phase là gì?**

> Thao tác hai bước (plan và apply) của Terraform cho phép xem lại thay đổi trước khi áp dụng. Plan phase so sánh trạng thái mong muốn (cấu hình) với trạng thái hiện tại (state file + hạ tầng thật) và tạo kế hoạch thực thi cho biết sẽ tạo, sửa, hoặc xóa gì. Điều này tạo ra một lớp an toàn trước khi đổi hạ tầng.

**Q: Làm thế nào để quản lý secrets trong IaC?**

> Tuyệt đối không commit secrets vào version control. Dùng:
> - **Terraform:** `sensitive = true` cho output, remote state mã hóa, và secrets trong Vault hoặc AWS Secrets Manager qua provider.
> - **Ansible:** Ansible Vault để mã hóa file, hoặc external secrets manager.
> - **Cả hai:** Environment variables, `.gitignore` cho file nhạy cảm, và CI/CD secret injection.

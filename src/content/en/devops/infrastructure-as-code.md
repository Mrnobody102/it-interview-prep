# DevOps - Infrastructure as Code (Terraform & Ansible)

## 1. What is Infrastructure as Code?

**Infrastructure as Code (IaC)** is the practice of managing and provisioning infrastructure through machine-readable configuration files, rather than manual processes. This ensures consistency, repeatability, and version control for infrastructure.

### 1.1. Declarative vs Imperative

| Approach | Declarative | Imperative |
|----------|-------------|------------|
| **Definition** | Define the desired end state | Define the step-by-step commands |
| **Example** | "I want 3 servers running" | "Create server 1, then server 2, then server 3" |
| **Tool examples** | Terraform, CloudFormation | Ansible (can do both), Bash scripts |
| **Behavior** | Figure out how to achieve the desired state | Execute predetermined commands |
| **Idempotency** | Built-in — same config = same result | Must be explicitly designed |

### 1.2. IaC Benefits

- **Version control** — Infrastructure changes are tracked in Git
- **Consistency** — Same config produces identical environments
- **Automation** — No manual provisioning steps
- **Reusability** — Modules and templates for repeatable patterns
- **Auditability** — Every change is documented and reviewable
- **Speed** — Provision infrastructure in minutes instead of days

---

## 2. Terraform

**Terraform** by HashiCorp is a declarative IaC tool that uses a domain-specific language (HCL — HashiCorp Configuration Language) to define and provision infrastructure across multiple cloud providers.

### 2.1. Core Concepts

```hcl
# provider defines which cloud/platform to use
provider "aws" {
  region = "us-east-1"
}

# resource is an infrastructure object
resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"

  tags = {
    Name        = "web-server"
    Environment = "production"
  }
}
```

### 2.2. Terraform Files

| File | Purpose |
|------|---------|
| `main.tf` | Main configuration (resources, data sources) |
| `variables.tf` | Input variable definitions |
| `outputs.tf` | Output value definitions |
| `terraform.tfvars` | Variable values (non-versioned secrets) |
| `.tf` files | Any `.tf` file is parsed |

### 2.3. Variables & Outputs

```hcl
# variables.tf
variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "instance_config" {
  description = "EC2 instance configuration"
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
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
```

```hcl
# outputs.tf
output "instance_public_ip" {
  description = "Public IP of the web server"
  value       = aws_instance.web_server.public_ip
}

output "instance_private_ip" {
  description = "Private IP of the web server"
  value       = aws_instance.web_server.private_ip
}

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.web_server.id
  sensitive   = true  # Hide from CLI output
}
```

### 2.4. Data Sources

```hcl
# Fetch existing VPC information
data "aws_vpc" "main" {
  id = "vpc-0123456789abcdef0"
}

# Get latest Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Reference data source values
resource "aws_instance" "server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.medium"
  vpc_security_group_ids = [aws_security_group.web.id]
  subnet_id     = data.aws_vpc.main.subnets[0].id
}
```

### 2.5. State Management

Terraform stores the state of managed infrastructure in a **state file**. This is critical for understanding what exists and planning changes.

```bash
# Local state (default, NOT for teams)
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}

# Remote state with S3 + DynamoDB (recommended for teams)
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

> **Important:** Never commit `terraform.tfstate` to version control, especially if it contains sensitive data. Use remote backends with state encryption.

### 2.6. Workspaces

```bash
# Create and switch workspaces
terraform workspace new prod
terraform workspace new staging
terraform workspace select prod

# List workspaces
terraform workspace list

# Use workspace in configuration
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
# main.tf — using the module
module "vpc" {
  source = "./modules/networking/vpc"

  cidr_block  = "10.0.0.0/16"
  environment = "production"
}
```

### 2.8. Terraform Commands

```bash
# Initialize (download providers, set up backend)
terraform init

# Validate configuration
terraform validate

# Format configuration
terraform fmt

# Show what will be created
terraform plan
terraform plan -var-file="prod.tfvars"
terraform plan -out=plan.tfplan     # Save plan to file

# Apply changes
terraform apply
terraform apply plan.tfplan        # Apply saved plan
terraform apply -auto-approve       # Skip approval prompt
terraform apply -var="environment=prod"

# Destroy resources
terraform destroy
terraform destroy -target=aws_instance.web_server  # Destroy specific resource

# Import existing infrastructure
terraform import aws_instance.existing i-0123456789abcdef0

# State management
terraform state list                    # List resources in state
terraform state show aws_instance.web  # Show resource details
terraform state mv aws_instance.old aws_instance.new  # Rename
terraform state rm aws_instance.old   # Remove from state
terraform state pull                  # Pull remote state locally
terraform state push                  # Push local state to remote

# Refresh state (reconcile with real infrastructure)
terraform refresh
```

### 2.9. Terraform vs Pulumi vs CloudFormation

| Feature | Terraform | Pulumi | CloudFormation |
|---------|-----------|--------|----------------|
| **Language** | HCL (custom) | General-purpose (TypeScript, Python, Go, etc.) | YAML/JSON |
| **State management** | External state file | External state file | Managed by AWS |
| **Multi-cloud** | Native (providers for all major clouds) | Native (all cloud SDKs) | AWS only (but cross-stack references exist) |
| **Learning curve** | HCL is easy but limited logic | Requires programming knowledge | Declarative but verbose |
| **Testing** | Terratest, Checkov | Standard testing frameworks | CloudFormation guards |
| **Drift detection** | Built-in | Built-in | Built-in |
| **Plan/Apply** | Two-phase | Two-phase | Direct (no plan phase) |
| **Approval workflow** | Yes | Yes | Yes (Change Sets) |

---

## 3. Ansible

**Ansible** is an agentless automation tool that uses SSH (or WinRM for Windows) to execute tasks on remote hosts. It supports both **imperative** (task-based) and **declarative** (playbook-based) approaches.

### 3.1. Key Concepts

| Concept | Description |
|---------|-------------|
| **Inventory** | List of hosts and groups to manage |
| **Playbook** | YAML file defining a set of plays (configurations) |
| **Play** | A set of tasks to run on a group of hosts |
| **Task** | A single action to perform (apt, copy, service, etc.) |
| **Handler** | Task that runs only when notified by other tasks |
| **Role** | Reusable collection of tasks, handlers, templates, variables |
| **Module** | Built-in or custom unit of work (apt, yum, copy, etc.) |
| **Fact** | System information gathered by Ansible before execution |

### 3.2. Inventory

```ini
# inventory/hosts.ini
# Simple inventory
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
# inventory/inventory.yml (YAML format)
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
  become: yes                    # Run as sudo
  vars:
    app_version: "1.2.3"
    app_directory: /opt/myapp

  tasks:
    - name: Install required packages
      apt:
        name:
          - nginx
          - curl
          - git
        state: present
        update_cache: yes

    - name: Create application directory
      file:
        path: "{{ app_directory }}"
        state: directory
        owner: deploy
        group: deploy
        mode: '0755'

    - name: Clone application repository
      git:
        repo: "https://github.com/myorg/myapp.git"
        dest: "{{ app_directory }}"
        version: "v{{ app_version }}"
        force: yes
      notify: Restart nginx

    - name: Create nginx configuration
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/sites-available/myapp.conf
        mode: '0644'
      notify: Enable nginx site

    - name: Ensure nginx is running
      service:
        name: nginx
        state: started
        enabled: yes

    - name: Run database migrations
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

### 3.4. Ansible Modules

```yaml
# Package management
- name: Install nginx (Debian/Ubuntu)
  apt:
    name: nginx
    state: present
    update_cache: yes

- name: Install httpd (RHEL/CentOS)
  yum:
    name: httpd
    state: present

# Service management
- name: Start and enable nginx
  service:
    name: nginx
    state: started
    enabled: yes

# File operations
- name: Create a directory
  file:
    path: /opt/myapp
    state: directory
    mode: '0755'
    owner: deploy
    group: deploy

- name: Copy file to server
  copy:
    src: ./config/app.conf
    dest: /etc/myapp/app.conf
    owner: root
    group: root
    mode: '0644'
    backup: yes                    # Backup existing file

# Template operations (using Jinja2)
- name: Render template
  template:
    src: config.j2
    dest: /etc/myapp/config.conf
    mode: '0644'
  vars:
    db_host: "{{ hostvars['db1.example.com']['ansible_host'] | default('localhost') }}"

# Command execution
- name: Run a shell command
  command: /opt/scripts/deploy.sh
  args:
    creates: /opt/myapp/.deployed   # Skip if this file exists (idempotent)
  register: deploy_output

- name: Display command output
  debug:
    msg: "{{ deploy_output.stdout }}"

# Package with pip
- name: Install Python packages
  pip:
    name:
      - flask
      - gunicorn
    state: present
    virtualenv: /opt/venv
    virtualenv_command: python3 -m venv

# Docker operations
- name: Build and start Docker container
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

# User management
- name: Create deploy user
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
    │   └── main.yml         # Default variables (lowest priority)
    ├── files/               # Static files to copy
    │   └── app.conf
    ├── handlers/
    │   └── main.yml         # Handlers
    ├── meta/
    │   └── main.yml         # Role metadata and dependencies
    ├── tasks/
    │   └── main.yml         # Main task list
    ├── templates/
    │   └── nginx.conf.j2   # Jinja2 templates
    └── vars/
        └── main.yml         # Variables (higher priority)
```

```yaml
# roles/myapp/tasks/main.yml
- name: Include OS-specific variables
  include_vars: "{{ ansible_facts['os_family'] | lower }}.yml"

- name: Install packages
  package:
    name: "{{ packages }}"
    state: present

- name: Deploy application
  include_role:
    name: myapp.deploy

- name: Configure application
  template:
    src: app.conf.j2
    dest: /etc/myapp/app.conf
  notify: Restart app
```

### 3.6. Idempotency in Ansible

Ansible is designed to be **idempotent** — running the same playbook multiple times produces the same result. Key principles:

> **Idempotent** means: applying the configuration N times should produce the same result as applying it once.

- Use `state: present` instead of manually checking and installing
- Use `creates` parameter on `command` to skip if already done
- Use `notify` / `handlers` instead of running actions on every run
- Use `changed_when` to control when Ansible considers a task "changed"
- Use `check_mode` to test without making changes

```yaml
# Idempotent examples
- name: Ensure nginx is installed
  apt:
    name: nginx
    state: present           # Idempotent — only installs if not present

- name: Create file
  file:
    path: /tmp/test.txt
    state: touch
    mode: '0644'
  # Idempotent — touching an existing file doesn't change it

- name: Run migration script
  command: npm run migrate
  args:
    creates: /opt/myapp/.migrated  # Skip if this file exists
  changed_when: false               # Treat as always "ok", not "changed"
```

### 3.7. Ansible Commands

```bash
# Inventory and connection testing
ansible all -i inventory/hosts.ini -m ping
ansible all -i inventory/hosts.ini -m command -a "uptime"
ansible all -i inventory/hosts.ini -m setup          # Gather facts

# Run a playbook
ansible-playbook -i inventory/hosts.ini playbook.yml
ansible-playbook -i inventory/hosts.ini playbook.yml --tags deploy
ansible-playbook -i inventory/hosts.ini playbook.yml --skip-tags database
ansible-playbook -i inventory/hosts.ini playbook.yml --check       # Dry-run
ansible-playbook -i inventory/hosts.ini playbook.yml --syntax-check

# Limit to specific hosts
ansible-playbook -i inventory/hosts.ini playbook.yml --limit webservers

# Step through playbook
ansible-playbook -i inventory/hosts.ini playbook.yml --step

# Pass extra variables
ansible-playbook -i inventory/hosts.ini playbook.yml -e "app_version=1.2.3"

# Vault for secrets
ansible-vault encrypt secrets.yml
ansible-vault decrypt secrets.yml
ansible-vault edit secrets.yml
ansible-playbook playbook.yml --ask-vault-pass
ansible-playbook playbook.yml --vault-password-file ~/.vault_pass.txt
```

### 3.8. Ansible vs Terraform Comparison

| Aspect | Terraform | Ansible |
|--------|-----------|---------|
| **Approach** | Declarative (desired state) | Imperative + Declarative |
| **Execution model** | Plans then applies | Pushes commands via SSH |
| **State** | Tracks state in state file | Stateless (no state file) |
| **Provisioners** | Built-in (local-exec, remote-exec) | Native SSH commands |
| **Best for** | Infrastructure provisioning | Configuration management, app deployment |
| **Idempotency** | Built-in (declarative) | Designed in (but needs care) |
| **Agentless** | Yes | Yes |
| **Learning curve** | HCL is simple | YAML is simple but playbooks can get complex |
| **Testing** | Terratest | Ansible Molecule |
| **Secret handling** | Vault integration | Ansible Vault |
| **Orchestration** | Limited (cross-cloud) | Strong (orchestrates anything via SSH) |

---

## 4. Interview Questions

**Q: What are the key differences between Terraform and Ansible?**

> Terraform is primarily **declarative** and focuses on **infrastructure provisioning** — it manages the lifecycle of cloud resources. Ansible is more **imperative** and excels at **configuration management** and **application deployment** — it runs tasks on existing servers. Many teams use both: Terraform to provision infrastructure, Ansible to configure it.

**Q: How does Terraform manage state, and why is it important?**

> Terraform stores the state of managed resources in a state file. It uses this state to map real-world resources to your configuration, track dependencies, and plan changes. State should be stored remotely (S3 with DynamoDB locking) in team environments to ensure consistency and prevent concurrent modifications.

**Q: What is idempotency, and how does Ansible achieve it?**

> Idempotency means running a configuration multiple times produces the same result as running it once. Ansible achieves this through modules that check the current state and only make changes if needed (e.g., `apt` with `state: present`). You should avoid bare `command` or `shell` modules without idempotency safeguards like `creates`, `when`, or `changed_when`.

**Q: What is Terraform's "plan" phase?**

> Terraform's two-phase operation (plan and apply) lets you review changes before applying them. The plan phase compares the desired state (configuration) against the current state (state file + real infrastructure) and generates an execution plan showing what will be created, modified, or destroyed. This provides a safety net before making infrastructure changes.

**Q: How do you manage secrets in IaC?**

> Never commit secrets to version control. Use:
> - **Terraform:** `sensitive = true` for output, encrypted remote state, and secrets in Vault or AWS Secrets Manager via providers.
> - **Ansible:** Ansible Vault for encrypting files, or external secrets managers.
> - **Both:** Environment variables, `.gitignore` sensitive files, and CI/CD secret injection.

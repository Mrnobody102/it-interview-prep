# Elixir Syntax

## Tổng quan

Erlang và Elixir là ngôn ngữ lập trình được thiết kế cho các hệ thống phân tán, fault-tolerant, real-time với uptime cao. Erlang VM (BEAM) là runtime nền tảng cho cả hai ngôn ngữ.

### Đặc điểm cốt lõi

| Đặc điểm | Mô tả |
|-----------|--------|
| **Actor Model** | Mỗi actor là một lightweight process riêng biệt |
| **Fault Tolerance** | "Let it crash" — process failure không ảnh hưởng hệ thống |
| **Soft Real-time** | Garbage collection per-process, không pause toàn bộ hệ thống |
| **Hot Code Reloading** | Deploy code không downtime |
| **Distributed** | Native hỗ trợ cluster qua Erlang distribution |

## Module và Functions

```elixir
# Module định nghĩa behavior
defmodule UserService do
  # Private function (không export)
  defp base_query do
    from u in User, where: u.active == true
  end

  # Public function với guard
  def find_by_email(email) when is_binary(email) do
    Repo.one(from u in base_query(), where: u.email == ^email)
  end

  # Default argument
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  # Pattern matching
  def process_order(%Order{status: "pending"} = order) do
    order |> change_status("processing") |> save()
  end

  def process_order(%Order{status: "completed"}), do: {:error, :already_completed}
end
```

### Guards và Pattern Matching

```elixir
# Guard clauses
def greet(name) when is_binary(name) and byte_size(name) > 0 do
  "Hello, #{name}!"
end

def greet(_), do: {:error, :invalid_name}

# Multiple pattern matching
def call([]), do: :empty
def call([head | tail]), do: {:ok, head, tail}

# Binary pattern matching
def parse_ip(<<a, b, c, d, rest::binary>>) do
  {a, b, c, d, rest}
end
```

## Data Structures

### Lists

```elixir
# List (linked list)
list = [1, 2, 3, 4, 5]
[head | tail] = list  # head = 1, tail = [2, 3, 4, 5]

# List operations
[0 | list]           # Prepend: [0, 1, 2, 3, 4, 5]
list ++ [6, 7]      # Concatenate
List.delete(list, 3) # Remove element
List.flatten([[1, 2], [3, 4]])  # Flatten nested lists

# List comprehensions
for x <- 1..5, x > 2, do: x * 2  # [6, 8, 10]
```

### Tuples

```elixir
# Tuple (fixed-size, fast access by index)
user = {"Alice", 30, :active}
{name, age, status} = user  # Pattern match

# Return tuple from function
def divide(a, b) do
  if b == 0 do
    {:error, :division_by_zero}
  else
    {:ok, a / b}
  end
end
```

### Maps

```elixir
# Map (key-value)
config = %{host: "localhost", port: 5432, timeout: 5000}
port = config[:port]  # 5432
%{port: p, host: h} = config  # Pattern match

# Update (creates new map)
new_config = %{config | port: 3306}

# Atom keys (special syntax)
%{name: "Alice", age: 30}  # Short for %{name: "Alice", age: 30}

# Nested update
users = %{user: %{name: "Alice", email: "alice@example.com"}}
put_in(users, [:user, :email], "new_email@example.com")
update_in(users, [:user, :age], &(&1 + 1))
```

### Structs

```elixir
# Struct (typed map)
defmodule User do
  defstruct [:name, :email, :role, :active]
end

alice = %User{name: "Alice", email: "alice@example.com", role: :admin, active: true}
alice.name  # "Alice"

# With defaults
defmodule Config do
  defstruct port: 8080, host: "localhost", timeout: 5000
end

%Config{}  # %Config{port: 8080, host: "localhost", timeout: 5000}
```

### Keyword Lists

```elixir
# Keyword list (list of 2-tuples, keys are atoms)
options = [name: "Alice", age: 30, active: true]
options[:name]  # "Alice"

# Often used for function options
def connect(url, opts \\ []) do
  timeout = Keyword.get(opts, :timeout, 5000)
  # ...
end
```

## Comprehensions và Enum

```elixir
# Transform data
users = [%{name: "Alice", age: 30}, %{name: "Bob", age: 25}]
names = for u <- users, do: u.name  # ["Alice", "Bob"]

# Filter
adults = for u <- users, u.age >= 18, do: u

# Nested comprehension
cartesian = for x <- 1..3, y <- 1..3, do: {x, y}
# [{1,1}, {1,2}, {1,3}, {2,1}, ...]

# With :into
map = for x <- 1..3, into: %{}, do: {x, x * x}
# %{1 => 1, 2 => 4, 3 => 9}

# Pipeline với Enum
1..100
|> Enum.filter(&(rem(&1, 3) == 0))
|> Enum.map(&(&1 * &1))
|> Enum.sum()
```

## Protocols và Behaviours

### Protocols (polymorphism)

```elixir
# Define a protocol
defprotocol Size do
  @doc "Returns the size in bytes"
  def size(data)
end

# Implement for a struct
defimpl Size, for: User do
  def size(%User{} = user) do
    byte_size(user.name) + byte_size(user.email)
  end
end
```

### Aliases và Imports

```elixir
# Alias
alias MyApp.Repo
Repo.all(User)  # thay vì MyApp.Repo.all(User)

alias MyApp.{Repo, User, Post}  # Multiple aliases

# Import
import Enum
[1, 2, 3] |> filter(&(&1 > 1)) |> map(&(&1 * 2))

# Import with only/except
import MyApp.Math, only: [add: 2, subtract: 2]

# Require (for macros)
require Logger
Logger.info("Hello")
```

## Câu hỏi phỏng vấn thường gặp

### 1. Elixir và Erlang khác nhau thế nào?

Elixir chạy trên BEAM (Erlang VM), compile xuống bytecode Erlang. Elixir cung cấp syntax hiện đại hơn, macro system mạnh, và tooling tốt hơn (Mix, ExUnit, Phoenix). Erlang cung cấp ngữ pháp truyền thống, otpstdlib sẵn có. Logic runtime hoàn toàn tương thích.

### 2. Elixir dùng `=` là assignment hay pattern matching?

`=` trong Elixir là **pattern matching**, không phải assignment. Khi `x = 1`, Elixir cố gắng match `x` với `1` và thành công, tạo ra biến `x` = 1. Khi `1 = x`, nó cũng thành công vì `1` match với giá trị hiện tại của `x`. Nếu match thất bại (ví dụ `2 = x`), sẽ raise `MatchError`.

### 3. Sự khác biệt giữa `list`, `tuple`, `map`, `struct`?

- **List**: Linked list, fast at prepending, slow random access by index
- **Tuple**: Fixed-size array, fast access by index, slow insertion/deletion
- **Map**: Key-value store, O(log n) access, keys can be any type
- **Struct**: Typed map backed by a module, enforces keys at compile time

### 4. Khi nào dùng `with` special form?

```elixir
# Thay vì nested case
with {:ok, user} <- Repo.get(User, id),
     {:ok, order} <- OrderService.create(user),
     {:ok, _} <- EmailNotifier.send(order) do
  {:ok, order}
else
  {:error, :not_found} -> {:error, :invalid_input}
  {:error, reason} -> {:error, reason}
end
```

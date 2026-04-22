# Elixir Syntax

## 1. Overview

Erlang and Elixir are programming languages designed for distributed, fault-tolerant, real-time systems with high uptime. The Erlang VM (BEAM) is the runtime platform for both languages.

### 1.1. Core features

| Feature | Description |
|---------|-------------|
| **Actor Model** | Each actor is a separate lightweight process |
| **Fault Tolerance** | "Let it crash" — process failure does not affect the system |
| **Soft Real-time** | Per-process garbage collection, no whole-system pause |
| **Hot Code Reloading** | Deploy code without downtime |
| **Distributed** | Native cluster support via Erlang distribution |

## 2. Modules and functions

```elixir
# Module defines behavior
defmodule UserService do
  # Private function (not exported)
  defp base_query do
    from u in User, where: u.active == true
  end

  # Public function with guard
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

### 2.1. Guards and pattern matching

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

## 3. Data structures

### 3.1. Lists

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

### 3.2. Tuples

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

### 3.3. Maps

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

### 3.4. Structs

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

### 3.5. Keyword lists

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

## 4. Comprehensions and `Enum`

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

# Pipeline with Enum
1..100
|> Enum.filter(&(rem(&1, 3) == 0))
|> Enum.map(&(&1 * &1))
|> Enum.sum()
```

## 5. Protocols and behaviours

### 5.1. Protocols (polymorphism)

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

### 5.2. Aliases and imports

```elixir
# Alias
alias MyApp.Repo
Repo.all(User)  # instead of MyApp.Repo.all(User)

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

## 6. Common interview questions

### 6.1. How do Elixir and Erlang differ?

Elixir runs on BEAM (Erlang VM), compiling down to Erlang bytecode. Elixir provides a more modern syntax, powerful macro system, and better tooling (Mix, ExUnit, Phoenix). Erlang provides traditional syntax and built-in otpstdlib. Runtime logic is fully compatible.

### 6.2. Is `=` in Elixir assignment or pattern matching?

`=` in Elixir is **pattern matching**, not assignment. When `x = 1`, Elixir tries to match `x` against `1`, succeeds, and binds `x` = 1. When `1 = x`, it also succeeds because `1` matches the current value of `x`. If matching fails (e.g., `2 = x`), it raises `MatchError`.

### 6.3. Difference between `list`, `tuple`, `map`, and `struct`?

- **List**: Linked list, fast at prepending, slow random access by index
- **Tuple**: Fixed-size array, fast access by index, slow insertion/deletion
- **Map**: Key-value store, O(log n) access, keys can be any type
- **Struct**: Typed map backed by a module, enforces keys at compile time

### 6.4. When do you use the `with` special form?

```elixir
# Instead of nested case
with {:ok, user} <- Repo.get(User, id),
     {:ok, order} <- OrderService.create(user),
     {:ok, _} <- EmailNotifier.send(order) do
  {:ok, order}
else
  {:error, :not_found} -> {:error, :invalid_input}
  {:error, reason} -> {:error, reason}
end
```

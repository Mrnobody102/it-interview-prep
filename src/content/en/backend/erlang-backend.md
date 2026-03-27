# Erlang / Elixir Backend

## Overview

Erlang and Elixir are programming languages designed for distributed, fault-tolerant, real-time systems with high uptime. The Erlang VM (BEAM) is the runtime platform for both languages.

### Core Features

| Feature | Description |
|---------|-------------|
| **Actor Model** | Each actor is a separate lightweight process |
| **Fault Tolerance** | "Let it crash" — process failure does not affect the system |
| **Soft Real-time** | Per-process garbage collection, no whole-system pause |
| **Hot Code Reloading** | Deploy code without downtime |
| **Distributed** | Native cluster support via Erlang distribution |

## Basic Elixir Syntax

### Modules and Functions

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

### Data Structures

```elixir
# List (linked list)
list = [1, 2, 3, 4, 5]
[h | t] = list  # h = 1, t = [2, 3, 4, 5]

# Tuple (fixed-size, fast access)
user = {"Alice", 30, :active}

# Map (key-value)
config = %{host: "localhost", port: 5432, timeout: 5000}
port = config[:port]  # 5432
%{port: p} = config    # pattern match

# Struct (typed map)
defmodule User do
  defstruct [:name, :email, :role, :active]
end

%User{name: "Bob", email: "bob@example.com", role: :admin}
```

### Comprehensions and Enum

```elixir
# Transform data
users = [%{name: "Alice", age: 30}, %{name: "Bob", age: 25}]
names = for u <- users, do: u.name  # ["Alice", "Bob"]

# Filter
adults = for u <- users, u.age >= 18, do: u

# Nested comprehension
cartesian = for x <- 1..3, y <- 1..3, do: {x, y}

# Pipeline
1..100
|> Enum.filter(&(rem(&1, 3) == 0))
|> Enum.map(&(&1 * &1))
|> Enum.sum()
```

## Concurrency and Processes

### Spawning Processes

```elixir
# Spawn a basic function
pid = spawn(fn ->
  receive do
    {:ping, caller} -> send(caller, :pong)
  end
end)

# Send message
send(pid, {:ping, self()})

# Receive with timeout
receive do
  :pong -> IO.puts("Received pong")
after
  5000 -> IO.puts("Timeout!")
end
```

### GenServer (Generic Server)

```elixir
defmodule Cache do
  use GenServer

  # Client API
  def start_link(default \\ %{}) do
    GenServer.start_link(__MODULE__, default, name: __MODULE__)
  end

  def get(key), do: GenServer.call(__MODULE__, {:get, key})
  def put(key, value), do: GenServer.cast(__MODULE__, {:put, key, value})
  def delete(key), do: GenServer.cast(__MODULE__, {:delete, key})

  # Server Implementation
  def init(default) do
    {:ok, default}
  end

  def handle_call({:get, key}, _from, state) do
    {:reply, Map.get(state, key), state}
  end

  def handle_cast({:put, key, value}, state) do
    {:noreply, Map.put(state, key, value)}
  end

  def handle_cast({:delete, key}, state) do
    {:noreply, Map.delete(state, key)}
  end
end
```

### Task and Supervisor

```elixir
# Task for fire-and-forget
Task.start(fn ->
  HeavyComputation.run()
end)

# Supervised task
children = [
  {Cache, []},
  %{id: :worker, start: {Worker, :start_link, []}, restart: :permanent}
]

Supervisor.start_link(children, strategy: :one_for_one)
```

## Phoenix Framework (Web)

### Router and Controllers

```elixir
defmodule MyAppWeb.Router do
  use MyAppWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
  end

  scope "/", MyAppWeb do
    pipe_through :browser
    get "/", PageController, :index
    resources "/users", UserController, only: [:index, :show]
  end

  scope "/api", MyAppWeb do
    pipe_through :api
    get "/health", HealthController, :check
  end
end
```

### LiveView (Real-time)

```elixir
defmodule MyAppWeb.CounterLive do
  use MyAppWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, :count, 0)}
  end

  def render(assigns) do
    ~H"""
    <button phx-click="inc">Count: <%= @count %></button>
    """
  end

  def handle_event("inc", _, socket) do
    {:noreply, assign(socket, :count, socket.assigns.count + 1)}
  end
end
```

## Ecto (Database)

```elixir
defmodule MyApp.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :name, :string
    field :email, :string
    field :role, :string
    timestamps()

    has_many :posts, MyApp.Post
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :role])
    |> validate_required([:name, :email])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end
end

# Query
alias MyApp.{Repo, User}

# Read
Repo.get(User, 1)
Repo.get_by(User, email: "alice@example.com")

# Create
%User{name: "Alice", email: "alice@example.com"}
|> User.changeset(%{role: "admin"})
|> Repo.insert!()

# Complex query
from(u in User,
  where: u.role == "admin",
  where: fragment("DATE(created_at) = ?", ^Date.utc_today()),
  order_by: [desc: :created_at],
  limit: 10
)
|> Repo.all()
```

## OTP Patterns

### Supervision Tree

```elixir
defmodule MyApp.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start Ecto
      MyApp.Repo,

      # Start Endpoint
      MyAppWeb.Endpoint,

      # Start Cache with restart strategy
      {Registry, keys: :unique, name: MyApp.Cache.Registry},
      {DynamicSupervisor, strategy: :one_for_one, name: MyApp.Cache.Supervisor},

      # Background workers
      {MyApp.Worker.Supervisor, []}
    ]

    opts = [strategy: :rest_for_one, name: MyApp.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
```

### GenStateMachine

```elixir
defmodule OrderMachine do
  use GenStateMachine, callback_mode: :state_functions

  @impl true
  def init(:ok), do: {:ok, :pending, %{}}

  # State: pending
  def pending(:internal, :check_payment, data) do
    case PaymentService.verify(data.order_id) do
      :ok -> {:next_state, :paid, data}
      :fail -> {:next_state, :failed, data}
    end
  end

  # State: paid
  def paid(:call, :ship, data) do
    {:keep_state_and_data, {:reply, :ok, :shipped}}
  end

  # Handle any state
  def active({:call, :get_state}, _from, state, data) do
    {:keep_state_and_data, {:reply, state, data}}
  end
end
```

## Common Interview Questions

### 1. How do Elixir and Erlang differ?

Elixir runs on BEAM (Erlang VM), compiling down to Erlang bytecode. Elixir provides a more modern syntax, powerful macro system, and better tooling (Mix, ExUnit, Phoenix). Erlang provides traditional syntax and built-in otpstdlib. Runtime logic is fully compatible.

### 2. GenServer vs Agent vs Task — when to use which?

- **Agent**: stateful, simple read/write — used for shared state
- **GenServer**: full control over state and behavior — used for complex services
- **Task**: fire-and-forget or async with result — used for background jobs
- **GenStateMachine**: when a state machine pattern is needed

### 3. How does "Let it crash" work?

Processes do not share memory. When a process crashes, the supervisor catches it and decides whether to restart. Each worker is wrapped in a supervisor. The crash occurs in the worker and does not affect the system. The supervisor restarts the worker to a clean state.

### 4. What is the difference between Ecto query and Ecto Schema?

`Ecto.Schema` defines the mapping from database table to Elixir struct. `Ecto.Query` builds SQL queries. `changeset/2` validates data before insert/update. Schema does not query directly — you must go through Repo.

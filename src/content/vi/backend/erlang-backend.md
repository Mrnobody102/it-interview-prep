# Erlang / Elixir Backend

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

## Elixir Syntax cơ bản

### Module và Functions

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

### Comprehensions và Enum

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

## Concurrency và Processes

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

### Task và Supervisor

```elixir
# Task cho fire-and-forget
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

### Router và Controllers

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

## Câu hỏi phỏng vấn thường gặp

### 1. Elixir và Erlang khác nhau thế nào?

Elixir chạy trên BEAM (Erlang VM), compile xuống bytecode Erlang. Elixir cung cấp syntax hiện đại hơn, macro system mạnh, và tooling tốt hơn (Mix, ExUnit, Phoenix). Erlang cung cấp ngữ pháp truyền thống, otpstdlib sẵn có. Logic runtime hoàn toàn tương thích.

### 2. GenServer vs Agent vs Task — khi nào dùng?

- **Agent**: stateful, simple read/write — dùng cho shared state
- **GenServer**: full control về state và behavior — dùng cho services phức tạp
- **Task**: fire-and-forget hoặc async với result — dùng cho background jobs
- **GenStateMachine**: khi state machine pattern cần thiết

### 3. "Let it crash" hoạt động như thế nào?

Processes không share memory. Khi một process crash, supervisor catch và quyết định restart hay không. Mỗi worker được wrap trong supervisor. Crash xảy ra trong worker, không ảnh hưởng hệ thống. Supervisor restart worker về clean state.

### 4. Ecto query vs Ecto Schema — khác nhau?

`Ecto.Schema` định nghĩa mapping từ database table → Elixir struct. `Ecto.Query` xây dựng SQL query. `changeset/2` validate data trước khi insert/update. Schema không query trực tiếp, phải qua Repo.

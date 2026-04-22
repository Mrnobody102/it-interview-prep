# Concurrency & OTP

## 1. Concurrency và processes

### 1.1. Spawning processes

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

### 1.2. Links và monitors

```elixir
# Links — crash together
spawn_link(fn -> raise "oops" end)

# Monitors — one-way observation
ref = spawn_monitor(fn -> :timer.sleep(1000); :done end)
receive do
  {:DOWN, ^ref, :process, _, reason} ->
    IO.puts("Process died: #{inspect(reason)}")
end
```

### 1.3. Agent (simple state)

```elixir
{:ok, agent} = Agent.start(fn -> %{} end)
Agent.update(agent, fn state -> Map.put(state, :count, 1) end)
Agent.get(agent, fn state -> state[:count] end)
```

## 2. GenServer (generic server)

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
  def clear, do: GenServer.cast(__MODULE__, :clear)

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

  def handle_cast(:clear, _state) do
    {:noreply, %{}}
  end
end
```

### 2.1. GenServer callbacks chi tiết

```elixir
# handle_call — synchronous, returns {:reply, response, new_state}
def handle_call(:get_count, _from, state) do
  {:reply, state.count, state}
end

# handle_cast — asynchronous, no response, returns {:noreply, new_state}
def handle_cast({:increment, n}, state) do
  {:noreply, %{state | count: state.count + n}}
end

# handle_info — messages sent directly to process
def handle_info(:cleanup, state) do
  # periodic cleanup
  schedule_cleanup()
  {:noreply, state}
end

# terminate — cleanup when server exits
def terminate(:normal, state) do
  :ets.delete(:my_cache)
  :ok
end
```

## 3. Task và supervisor

### 3.1. Task cho fire-and-forget

```elixir
# Fire and forget
Task.start(fn ->
  HeavyComputation.run()
end)

# Async with result
{:ok, task} = Task.start_link(fn ->
  :timer.sleep(1000)
  "done"
end)
Task.await(task)

# Many async tasks
tasks = for i <- 1..10, do: Task.async(fn -> compute(i) end)
results = Task.await_many(tasks)
```

### 3.2. Supervised task

```elixir
# Static children list
children = [
  {Cache, []},
  %{id: :worker, start: {Worker, :start_link, []}, restart: :permanent}
]

Supervisor.start_link(children, strategy: :one_for_one)
```

## 4. OTP supervision strategies

### 4.1. Các chiến lược supervisor

```elixir
# One-for-one: restart chỉ process bị crash
Supervisor.start_link([
  {Worker, []}
], strategy: :one_for_one)

# One-for-all: restart tất cả nếu bất kỳ process nào crash
Supervisor.start_link([
  {Cache, []},
  {EventHandler, []}
], strategy: :one_for_all)

# Rest-for-one: restart process phía dưới nó bị crash
Supervisor.start_link([
  {MainWorker, []},
  {SubWorker1, []},
  {SubWorker2, []}
], strategy: :rest_for_one)

# One-for-one-within-supervisor: restart tất cả workers
# (không restart supervisors con)
```

### 4.2. `DynamicSupervisor`

```elixir
# Start dynamic supervisor
{:ok, sup} = DynamicSupervisor.start_link(strategy: :one_for_one)

# Dynamically spawn workers
DynamicSupervisor.start_child(sup, {Worker, args})

# Count children
DynamicSupervisor.count_children(sup)
```

### 4.3. Error kernel pattern

```elixir
defmodule MyApp.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Critical services first
      MyApp.Repo,
      MyApp.Cache,

      # Workers after critical services
      {MyApp.Worker.Supervisor, strategy: :one_for_one},
    ]

    Supervisor.start_link(children, strategy: :rest_for_one)
  end
end
```

## 5. Distributed Erlang

```elixir
# Node 1:
Node.start(:node1@localhost)
Process.register(self(), :coordinator)

# Node 2:
Node.start(:node2@localhost)
Node.connect(:node1@localhost)

# Giao tiếp cross-node
send({:coordinator, :node1@localhost}, {:task, self()})

receive do
  {:result, value} -> IO.puts("Got: #{value}")
end
```

## 6. Behavior và custom behaviors

### 6.1. Dựng custom behavior

```elixir
defmodule MyServer do
  use GenServer

  # Callbacks bắt buộc
  @impl true
  def init(args) do
    {:ok, args}
  end

  @impl true
  def handle_call(:get_state, _from, state) do
    {:reply, state, state}
  end

  # Override handle_info
  @impl true
  def handle_info(:timeout, state) do
    {:noreply, state}
  end
end
```

### 6.2. ETS-based server (stateless)

```elixir
defmodule ETSRegistry do
  def start_link do
    GenServer.start_link(__MODULE__, :ets.new(__MODULE__, [:set, :named_table]), name: __MODULE__)
  end

  @impl true
  def init(table) do
    {:ok, table}
  end

  def put(key, value) do
    :ets.insert(__MODULE__, {key, value})
  end

  def get(key) do
    case :ets.lookup(__MODULE__, key) do
      [{^key, value}] -> {:ok, value}
      [] -> {:error, :not_found}
    end
  end
end
```

## 7. Caching và performance

### 7.1. ETS (Erlang Term Storage)

```elixir
# Tạo ETS table
:ets.new(:user_cache, [:set, :named_table, read_concurrency: true])

# Write
:ets.insert(:user_cache, {"user_1", %{name: "Alice", email: "alice@example.com"}})

# Read
:ets.lookup(:user_cache, "user_1")

# Auto-expiring cache với TTL
defmodule TTLCache do
  use GenServer

  def start_link(default) do
    GenServer.start_link(__MODULE__, default, name: __MODULE__)
  end

  def put(key, value, ttl_ms) do
    GenServer.cast(__MODULE__, {:put, key, value, ttl_ms})
  end

  def get(key) do
    case :ets.lookup(__MODULE__, key) do
      [{^key, value, expiry}] when expiry > System.system_time(:millisecond) ->
        {:ok, value}
      _ -> :not_found
    end
  end

  @impl true
  def init(_default) do
    :ets.new(__MODULE__, [:set, :named_table, read_concurrency: true])
    {:ok, %{}}
  end
end
```

### 7.2. Process dictionary (tránh dùng)

```elixir
# KHONG nên dùng trong production - khó test, không distributed
Process.put(:current_user_id, 123)
user_id = Process.get(:current_user_id)
Process.delete(:current_user_id)
```

### 7.3. Performance tips

- Dùng `concurrent` thay vì `sequential` khi có thể
- ETS cho in-memory cache nhanh
- `:persistent_term` cho constants
- Tránh large messages giữa processes
- Dùng `binary` thay vì `list` cho string
- `iodata` cho output streams

## 8. OTP patterns

### 8.1. Supervision tree

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

### 8.2. `GenStateMachine`

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

## 9. Câu hỏi phỏng vấn thường gặp

### 9.1. GenServer vs Agent vs Task: khi nào dùng?

- **Agent**: stateful, simple read/write — dùng cho shared state
- **GenServer**: full control về state và behavior — dùng cho services phức tạp
- **Task**: fire-and-forget hoặc async với result — dùng cho background jobs
- **GenStateMachine**: khi state machine pattern cần thiết

### 9.2. "Let it crash" hoạt động như thế nào?

Processes không share memory. Khi một process crash, supervisor catch và quyết định restart hay không. Mỗi worker được wrap trong supervisor. Crash xảy ra trong worker, không ảnh hưởng hệ thống. Supervisor restart worker về clean state.

### 9.3. Sự khác biệt giữa `handle_call`, `handle_cast`, `handle_info`?

- `handle_call`: synchronous — client đợi reply, dùng cho operations cần result
- `handle_cast`: asynchronous — không reply, dùng cho fire-and-forget operations
- `handle_info`: xử lý messages gửi trực tiếp đến process (không qua GenServer.call/cast)

### 9.4. ETS có những loại table nào?

- `:set` — mỗi key unique (default)
- `:ordered_set` — ordered by key
- `:bag` — cho phép duplicate keys
- `:duplicate_bag` — cho phép duplicate keys và values

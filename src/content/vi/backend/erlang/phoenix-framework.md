# Phoenix Framework

## Router và Controllers

### Router cơ bản

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
    resources "/users", UserController, only: [:index, :show, :new, :create]
  end

  scope "/api", MyAppWeb do
    pipe_through :api
    get "/health", HealthController, :check
    resources "/posts", PostController
  end
end
```

### Plugs

```elixir
# Custom plug
defmodule MyAppWeb.Plugs.RequireAuth do
  import Plug.Conn
  import Phoenix.Controller, only: [put_flash: 3, redirect: 2]

  def init(options), do: options

  def call(conn, _opts) do
    if conn.assigns[:current_user] do
      conn
    else
      conn
      |> put_flash(:error, "You must be logged in")
      |> redirect(to: "/login")
      |> halt()
    end
  end
end

# Dùng trong router
pipeline :protected do
  plug :accepts, ["html"]
  plug MyAppWeb.Plugs.RequireAuth
end
```

### Controllers

```elixir
defmodule MyAppWeb.UserController do
  use MyAppWeb, :controller
  alias MyApp.{Repo, User}

  # GET /users
  def index(conn, _params) do
    users = Repo.all(User)
    render(conn, "index.html", users: users)
  end

  # GET /users/new
  def new(conn, _params) do
    changeset = User.changeset(%User{})
    render(conn, "new.html", changeset: changeset)
  end

  # POST /users
  def create(conn, %{"user" => user_params}) do
    %User{}
    |> User.changeset(user_params)
    |> Repo.insert()
    |> case do
      {:ok, user} ->
        conn
        |> put_flash(:info, "User created!")
        |> redirect(to: Routes.user_path(conn, :show, user))

      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  # Show, edit, update, delete...
  def show(conn, %{"id" => id}) do
    user = Repo.get!(User, id)
    render(conn, "show.html", user: user)
  end
end
```

## Contexts (Domain Logic)

```elixir
# Tách business logic vào contexts
defmodule MyApp.Accounts do
  @moduledoc """
  The Accounts context.
  """
  import Ecto.Query
  alias MyApp.Repo
  alias MyApp.Accounts.User

  def get_user!(id), do: Repo.get!(User, id)

  def get_user_by_email(email) do
    Repo.get_by(User, email: email)
  end

  def create_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def authenticate_user(email, password) do
    with {:ok, user} <- get_user_by_email(email),
         true <- Bcrypt.verify_pass(password, user.password_hash) do
      {:ok, user}
    else
      _ -> {:error, :invalid_credentials}
    end
  end
end
```

## LiveView (Real-time)

### Counter LiveView

```elixir
defmodule MyAppWeb.CounterLive do
  use MyAppWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, :count, 0)}
  end

  def render(assigns) do
    ~H"""
    <div>
      <h1>Count: <%= @count %></h1>
      <button phx-click="inc">+</button>
      <button phx-click="dec">-</button>
      <button phx-click="reset" phx-value-n="0">Reset</button>
    </div>
    """
  end

  def handle_event("inc", _, socket) do
    {:noreply, assign(socket, :count, socket.assigns.count + 1)}
  end

  def handle_event("dec", _, socket) do
    {:noreply, assign(socket, :count, socket.assigns.count - 1)}
  end

  def handle_event("reset", %{"n" => n}, socket) do
    {:noreply, assign(socket, :count, String.to_integer(n))}
  end
end
```

### LiveView với form

```elixir
defmodule MyAppWeb.UserFormLive do
  use MyAppWeb, :live_view

  def mount(_params, _session, socket) do
    changeset = User.changeset(%User{})
    {:ok, assign(socket, changeset: changeset)}
  end

  def handle_event("validate", %{"user" => user_params}, socket) do
    changeset =
      %User{}
      |> User.changeset(user_params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, changeset: changeset)}
  end

  def handle_event("save", %{"user" => user_params}, socket) do
    case Accounts.create_user(user_params) do
      {:ok, _user} ->
        {:noreply,
         socket
         |> put_flash(:info, "User created")
         |> redirect(to: "/users")}

      {:error, changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end
end
```

### PubSub trong LiveView

```elixir
# Server-side broadcast
defmodule MyApp.Notifications do
  def broadcast({:ok, result}, event) do
    Phoenix.PubSub.broadcast(MyApp.PubSub, event, {event, result})
    {:ok, result}
  end
end

# Subscribe in mount
def mount(_params, _session, socket) do
  if connected?(socket) do
    Phoenix.PubSub.subscribe(MyApp.PubSub, "users:lobby")
  end
  {:ok, assign(socket, users: [])}
end

# Receive broadcast
def handle_info({:user_created, user}, socket) do
  {:noreply, update(socket, :users, fn users -> [user | users] end)}
end
```

## Ecto (Database)

### Schema

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
    has_one :profile, MyApp.Profile
    many_to_many :roles, MyApp.Role, join_through: "user_roles"
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :role])
    |> validate_required([:name, :email])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end
end
```

### Query

```elixir
alias MyApp.{Repo, User}

# Read
Repo.get(User, 1)
Repo.get_by(User, email: "alice@example.com")
Repo.all(from u in User, where: u.active == true)

# Create
%User{name: "Alice", email: "alice@example.com"}
|> User.changeset(%{role: "admin"})
|> Repo.insert!()

# Update
user = Repo.get!(User, 1)
user |> User.changeset(%{name: "Bob"}) |> Repo.update!()

# Delete
user |> Repo.delete!()

# Complex query
from(u in User,
  where: u.role == "admin",
  where: fragment("DATE(created_at) = ?", ^Date.utc_today()),
  order_by: [desc: :created_at],
  limit: 10
)
|> Repo.all()
```

### Associations

```elixir
# Preload associations
user = Repo.get!(User, 1) |> Repo.preload(:posts)
for post <- user.posts, do: post.title

# Query with joins
from(u in User,
  join: p in assoc(u, :posts),
  where: p.published == true,
  distinct: true,
  select: u
)
|> Repo.all()
```

## Channels (WebSockets)

```elixir
defmodule MyAppWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("room:" <> private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast!(socket, "new_msg", %{
      body: body,
      user: socket.assigns[:user]
    })
    {:noreply, socket}
  end

  def handle_in("ping", payload, socket) do
    {:reply, {:ok, %{pong: payload["echo"]}}, socket}
  end
end
```

## Câu hỏi phỏng vấn thường gặp

### 1. Phoenix Context vs Controller — khác nhau?

**Context** là module chứa business logic, tách biệt khỏi web layer. **Controller** chỉ nhận request và trả response. Context giữ logic domain độc lập với web framework, dễ test và tái sử dụng. Controller gọi context functions để lấy data.

### 2. Ecto query vs Ecto Schema — khác nhau?

`Ecto.Schema` định nghĩa mapping từ database table → Elixir struct. `Ecto.Query` xây dựng SQL query. `changeset/2` validate data trước khi insert/update. Schema không query trực tiếp, phải qua Repo.

### 3. LiveView hoạt động như thế nào?

LiveView kết nối WebSocket giữa client và server. Server-side rendering với HTML được gửi ban đầu, sau đó user interactions gửi events qua WebSocket. `handle_event` callback xử lý, `assign` cập nhật state, `render` trả về HTML diff. Không cần client-side JS cho business logic.

### 4. Sự khác biệt giữa Channel và LiveView?

**Channels** cho các ứng dụng real-time với custom protocol (chat, notifications, collaborative editing). **LiveView** cho full-page interactive UI với server-side rendering, tự động diff HTML. LiveView là abstraction cao hơn trên Channels.

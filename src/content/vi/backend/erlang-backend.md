# Erlang / Elixir Backend

## 1. Tổng quan

Erlang và Elixir là ngôn ngữ lập trình được thiết kế cho các hệ thống phân tán, fault-tolerant, real-time với uptime cao. Erlang VM (BEAM) là runtime nền tảng cho cả hai ngôn ngữ.

### 1.1. Đặc điểm cốt lõi

| Đặc điểm | Mô tả |
|-----------|--------|
| **Actor Model** | Mỗi actor là một lightweight process riêng biệt |
| **Fault Tolerance** | "Let it crash" — process failure không ảnh hưởng hệ thống |
| **Soft Real-time** | Garbage collection per-process, không pause toàn bộ hệ thống |
| **Hot Code Reloading** | Deploy code không downtime |
| **Distributed** | Native hỗ trợ cluster qua Erlang distribution |

## 2. Các chủ đề con

| Chủ đề | Mô tả |
|---------|-------|
| **Elixir Syntax** | Syntax cơ bản, data structures, pattern matching, protocols |
| **Concurrency & OTP** | GenServer, Task, Supervisor, ETS, distributed Erlang |
| **Phoenix Framework** | Router, Controllers, LiveView, Ecto, Channels |

## 3. Elixir và Erlang

Elixir chạy trên BEAM (Erlang VM), compile xuống bytecode Erlang. Elixir cung cấp syntax hiện đại hơn, macro system mạnh, và tooling tốt hơn (Mix, ExUnit, Phoenix). Erlang cung cấp ngữ pháp truyền thống, otpstdlib sẵn có. Logic runtime hoàn toàn tương thích.

## 4. Câu hỏi phỏng vấn thường gặp

### 4.1. Vì sao BEAM mạnh trong hệ thống concurrency cao?

Vì BEAM chạy được số lượng rất lớn lightweight process, cô lập lỗi tốt, và scheduler phân phối công việc công bằng mà không cần map mỗi task thành một OS thread.

### 4.2. Erlang process khác gì OS thread?

Erlang process nhẹ hơn rất nhiều, có vùng nhớ tách biệt, giao tiếp bằng message passing, và được VM scheduler quản lý thay vì hệ điều hành.

### 4.3. Khi nào nên chọn Elixir/Erlang thay vì Go hoặc Java?

Nên chọn khi fault tolerance, long-lived connection, soft real-time behavior và operational resilience quan trọng hơn raw single-thread performance.

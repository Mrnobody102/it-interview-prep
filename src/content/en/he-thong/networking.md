# Networking (Technical Interview Prep)

## Overview
**Networking** is the backbone of any system. In a system design interview, you don't need to be a Cisco expert, but you must understand how data travels from a user's browser to the server and how to protect that journey.

---

## 1. The OSI Model (Keep It Simple)
Forget the 7 layers for a moment. In web development, focus on these two:
- **Layer 4 (Transport):** TCP/UDP. Think of it as the "Postman" who delivers the package.
- **Layer 7 (Application):** HTTP/HTTPS, DNS. This is the "Message" inside the package.

**Interview Tip:** When a Load Balancer works at Layer 4, it only sees IP addresses and Ports. At Layer 7, it can "read" the HTTP Header, Cookies, and URL to make smarter routing decisions.

---

## 2. DNS (The Phonebook of the Internet)
DNS translates a human-readable name (`google.com`) into an IP address (`172.217.161.142`).

**Real-world Analogy:** It’s like searching for a contact in your phone. You tap "Mom" (Domain), and the phone dials `09xx...` (IP).

---

## 3. Firewall & NAT
- **Firewall:** The "Bouncer" at a club. It checks everyone's ID and denies entry to anyone on the blacklist or anyone not invited (Security Rules).
- **NAT (Network Address Translation):** The "Apartment Building Receptionist". All residents (Private IPs) send mail out through the receptionist (Public IP). When mail comes back, the receptionist knows exactly which room to deliver it to.

---

## 4. CORS (Cross-Origin Resource Sharing)
**Scenario:** Your frontend at `myapp.com` tries to call an API at `api.com`. 
The browser stops this and asks: *"Wait! Is `api.com` okay with `myapp.com` talking to it?"* 

**Analogy:** You go to a neighbor's house (Another Origin) and try to take a beer from their fridge (Resource). The neighbor has to give you permission first. CORS is that permission check.

---

## 5. Typical Interview Questions

> **Q: What happens when you type a URL into a browser?**
>
> **A:** (The concise version)
> 1. **DNS Lookup:** Browser finds the IP of the domain.
> 2. **TCP Handshake:** Establish a connection with the server.
> 3. **SSL/TLS Handshake:** Secure the connection (HTTPS).
> 4. **HTTP Request:** Browser asks for the page content.
> 5. **Server Response:** Server sends HTML/Data back.
> 6. **Browser Render:** Browser displays the page.

---

## 6. Summary for Interviews

| Concept | Key takeaway | Analogy |
|---|---|---|
| **OSI Layer 7** | Application level (HTTP) | The letter content |
| **OSI Layer 4** | Transport level (TCP) | The postman |
| **Firewall** | Security filter | The Bouncer |
| **DNS** | Name to IP translation | Phonebook |
| **NAT** | Shared public IP | Apartment Receptionist |
| **CORS** | Browser security | Neighbor's permission |

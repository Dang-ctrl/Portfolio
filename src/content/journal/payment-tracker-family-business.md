---
title: "Shipped a payment system for a real business"
date: 2026-03-10
category: milestone
summary: "An internal payment coordination tool — approvals, execution tracking, audit trails — now used by my family's business."
tags: [Next.js, PostgreSQL, System Design]
---

Most of what I build starts as a demo. This one didn't — it had real users from day one, and a bug means someone doesn't get paid.

## The problem

Payments moved through calls, chats and memory. Nobody could say, at a glance, what was requested, who approved it and whether it was actually settled.

## What I built

- A multi-role approval pipeline: **request → review → approve → execute → settle**
- Real-time status for every payment
- Audit-grade logs of every change

## What I learned

Structure first, edge cases next, interface last. The UI was the easy part — getting the states and permissions right was the real work.

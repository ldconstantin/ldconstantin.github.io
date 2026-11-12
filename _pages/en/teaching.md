---
title: Teaching
description: "Programming, algorithms, data structures, and operating systems courses taught in technical and undergraduate programs."
layout: default
nav_order: 1
has_toc: false
lang: en-US
locale: en
translation_key: teaching
permalink: /en/teaching/
---

# Teaching

Courses taught in technical and undergraduate programs, organized by term.

<section class="teaching-current-courses" aria-labelledby="current-courses-title">
  <div class="home-courses-heading">
    <h2 id="current-courses-title">Current courses</h2>
    <span>2026/2</span>
  </div>
  <ul class="home-course-list" role="list">
    <li>
      <h3 id="data-structures-iii">Data Structures III</h3>
      <p>Sorting and searching algorithms and their applications</p>
    </li>
    <li>
      <h3 id="operating-systems-ii">Operating Systems II</h3>
      <p>Concurrent programming, synchronization mechanisms, and real-time systems</p>
    </li>
    <li>
      <h3 id="web-page-development">Web Page Development</h3>
      <p>Structuring pages with HTML, styling with CSS, and adding interactivity with JavaScript</p>
    </li>
    <li>
      <h3 id="object-oriented-programming">Object-Oriented Programming</h3>
      <p>Object-oriented programming in Python, design patterns, and software architectures</p>
    </li>
  </ul>
</section>

## Previous courses

### 2026/1

<ul class="home-course-list" role="list">
  <li>
    <h4 id="logic-and-algorithms">Logic and Algorithms</h4>
    <p>Fundamentals of logic and Python programming for Mechanical Engineering.</p>
  </li>
  <li>
    <h4 id="competitive-programming">Competitive Programming</h4>
    <p>Algorithmic strategies for solving programming contest problems.</p>
  </li>
  <li>
    <h4 id="introduction-to-cpp">Introduction to C++ Programming</h4>
    <p>C++ fundamentals: compilation, types, control structures, functions, and the standard library.</p>
  </li>
</ul>

### 2025/2

<ul class="home-course-list" role="list">
  <li>
    <h4 id="introduction-to-javascript">Introduction to JavaScript Programming</h4>
    <p>Algorithms in JavaScript and basic web application development.</p>
  </li>
  <li>
    <h4 id="algorithm-analysis-and-complexity">Algorithm Analysis and Complexity</h4>
    <p>Analysis of algorithm time and space complexity.</p>
  </li>
</ul>

## Algorithm study materials

Code examples that may support the study of algorithms and data structures. **Publication does not establish that they were used in a particular class.**

- [Kruskal with Union-Find]({{ '/en/solutions/kruskal/' | relative_url }}): graphs, greedy methods, and connected components.
- [Bottom-up dynamic programming]({{ '/en/solutions/bee1034-bottomup/' | relative_url }}): states, recurrence, and complexity.
- [Segment tree with lazy propagation]({{ '/en/solutions/bee1500/' | relative_url }}): range updates and sum queries.
- [Archive of 18 solutions]({{ '/en/solutions/' | relative_url }}): examples by topic, with provenance and known limits.

## Demonstration learning activity

**Topic:** compare Kruskal and Prim for finding a minimum spanning tree. This is a **self-study proposal**, not a report of an activity already taught to a class.

**Prerequisites:** undirected graphs, sorting, priority queues, and asymptotic analysis.

**Problem:** a network connects vertices 0, 1, and 2. The edges cost 2 (0–1), 3 (1–2), and 9 (0–2). Connect all vertices at minimum total cost.

**Study steps:**

1. Draw the graph. Select the two minimum-cost tree edges manually and explain why the third edge is unnecessary.
2. Run the [Kruskal implementation]({{ '/en/solutions/kruskal/' | relative_url }}) and the [Prim implementation]({{ '/en/solutions/prim/' | relative_url }}). Compare the selected edges and the total cost.
3. Explain the difference between **Union-Find** (Kruskal) and a **priority queue** (Prim). Estimate their time complexity for adjacency lists and edge sorting.
4. Remove edge 1–2, then also remove edge 0–2. Explain what each implementation does when the graph becomes disconnected.

**Expected result:** edges 0–1 and 1–2, with total cost **5** in the original graph. For disconnected graphs, the Kruskal example may yield a forest and the Prim example computes only the starting component; neither result is a spanning tree over all vertices.

**Proposed assessment rubric:** correct selection and justification (40%); comparison of strategies and complexity (40%); analysis of disconnected cases (20%). These percentages describe **a proposed rubric**, not students' marks.

## Educational material collaboration

- **2026 ENADE practice examination, BSc in Computer Science (IFSul Passo Fundo):** contributed to layout and editorial preparation of the question booklet. I do not claim authorship of the questions or prompts. The complete institutional material is not distributed on this website.

## Topics under development

- ### AI Literacy {#ai-literacy}
  Topic under study: generative AI concepts, applications, and limitations, critical evaluation of responses, and responsible use.

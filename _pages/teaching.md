---
layout: page
permalink: /teaching/
title: Teaching
description: 
nav: true
nav_order: 6
---
<style>
  .teaching-outcomes-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
  }

  .teaching-outcomes-panel {
    border: 1px solid var(--global-divider-color);
    border-radius: 10px;
    padding: 0.75rem 0.8rem;
    background: color-mix(in srgb, var(--global-card-bg-color) 92%, var(--global-bg-color) 8%);
  }

  .teaching-outcomes-label {
    font-size: 0.88rem;
    color: var(--global-text-color-light);
    margin-bottom: 0.25rem;
  }

  .teaching-outcomes-value {
    font-size: 1.55rem;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 0.35rem;
    color: var(--global-text-color);
  }

  .teaching-outcomes-sub {
    font-size: 0.83rem;
    color: var(--global-text-color-light);
    line-height: 1.3;
  }

  .teaching-dist-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .teaching-dist-row + .teaching-dist-row {
    margin-top: 0.38rem;
  }

  .teaching-dist-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 0.84rem;
    color: var(--global-text-color);
    margin-bottom: 0.12rem;
  }

  .teaching-dist-track {
    height: 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--global-divider-color) 70%, transparent);
    overflow: hidden;
  }

  .teaching-dist-fill {
    height: 100%;
    border-radius: 999px;
  }

  .teaching-dist-fill-undergrad {
    width: 92.9%;
    background: #2f8fdb;
  }

  .teaching-dist-fill-graduate {
    width: 5.1%;
    background: #7a8ca6;
  }

  .teaching-dist-fill-highschool {
    width: 2%;
    background: #47a56b;
  }

  .mentoring-outcomes-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
  }

  .mentoring-outcomes-panel {
    border: 1px solid var(--global-divider-color);
    border-radius: 10px;
    padding: 0.75rem 0.8rem;
    background: color-mix(in srgb, var(--global-card-bg-color) 92%, var(--global-bg-color) 8%);
  }

  .mentoring-section-label {
    font-size: 0.88rem;
    color: var(--global-text-color-light);
    margin-bottom: 0.28rem;
  }

  .mentoring-year-list,
  .mentoring-school-list,
  .mentoring-degree-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .mentoring-year-item + .mentoring-year-item,
  .mentoring-school-item + .mentoring-school-item,
  .mentoring-degree-item + .mentoring-degree-item {
    margin-top: 0.35rem;
  }

  .mentoring-row-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 0.84rem;
    color: var(--global-text-color);
    margin-bottom: 0.1rem;
  }

  .mentoring-track {
    height: 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--global-divider-color) 70%, transparent);
    overflow: hidden;
  }

  .mentoring-fill {
    height: 100%;
    border-radius: 999px;
  }

  .mentoring-fill-year-2023 {
    width: 25%;
    background: #2f8fdb;
  }

  .mentoring-fill-year-2022 {
    width: 62.5%;
    background: #4f99de;
  }

  .mentoring-fill-year-2021 {
    width: 43.8%;
    background: #6ca8e3;
  }

  .mentoring-fill-year-2020 {
    width: 37.5%;
    background: #85b6e7;
  }

  .mentoring-fill-year-2019 {
    width: 100%;
    background: #2a74c9;
  }

  .mentoring-fill-school-uci {
    width: 100%;
    background: #2f8fdb;
  }

  .mentoring-fill-school-cmu {
    width: 100%;
    background: #3f9b73;
  }

  .mentoring-fill-school-ucsd {
    width: 50%;
    background: #7a8ca6;
  }

  .mentoring-fill-school-others {
    width: 25%;
    background: #9aa5b3;
  }

  .mentoring-fill-degree-undergrad {
    width: 100%;
    background: #2f8fdb;
  }

  .mentoring-fill-degree-ms {
    width: 15.2%;
    background: #7a8ca6;
  }

  .mentoring-fill-degree-phd {
    width: 15.2%;
    background: #47a56b;
  }

  .mentoring-note {
    font-size: 0.83rem;
    color: var(--global-text-color-light);
    line-height: 1.35;
    margin-top: 0.55rem;
  }

  .teaching-log-list .teaching-log-grid {
    display: grid !important;
    grid-template-columns: minmax(92px, 130px) minmax(220px, 1fr) minmax(320px, 1.45fr) !important;
    gap: 0.7rem !important;
    align-items: start !important;
  }

  @media (max-width: 680px) {
    .teaching-outcomes-grid {
      grid-template-columns: 1fr;
    }

    .mentoring-outcomes-grid {
      grid-template-columns: 1fr;
    }

    .teaching-log-list .teaching-log-grid {
      grid-template-columns: 1fr !important;
      gap: 0.3rem !important;
    }
  }
</style>

<div class="card mt-3 p-3">
  <h3 class="card-title font-weight-medium">Current Teaching</h3>
  <ul class="mb-0">
    <li>No teaching scheduled at the moment.</li>
  </ul>
</div>

<div class="card mt-3 p-3">
  <h3 class="card-title font-weight-medium">Teaching Outcomes</h3>
  <div class="teaching-outcomes-grid">
    <div class="teaching-outcomes-panel">
      <div class="teaching-outcomes-label">Cumulative Learners</div>
      <div class="teaching-outcomes-value">2,631+</div>
      <div class="teaching-outcomes-sub">Aggregated across courses and educational events.</div>
    </div>
    <div class="teaching-outcomes-panel">
      <div class="teaching-outcomes-label">Course Coverage</div>
      <div class="teaching-outcomes-value">14</div>
      <div class="teaching-outcomes-sub">Distinct courses/events taught across UCI and external programs.</div>
    </div>
    <div class="teaching-outcomes-panel">
      <div class="teaching-outcomes-label">Audience Distribution</div>
      <ul class="teaching-dist-list">
        <li class="teaching-dist-row">
          <div class="teaching-dist-head"><span>Undergrad / College</span><span>2,445 (92.9%)</span></div>
          <div class="teaching-dist-track"><div class="teaching-dist-fill teaching-dist-fill-undergrad"></div></div>
        </li>
        <li class="teaching-dist-row">
          <div class="teaching-dist-head"><span>Graduate</span><span>134 (5.1%)</span></div>
          <div class="teaching-dist-track"><div class="teaching-dist-fill teaching-dist-fill-graduate"></div></div>
        </li>
        <li class="teaching-dist-row">
          <div class="teaching-dist-head"><span>High School</span><span>52 (2.0%)</span></div>
          <div class="teaching-dist-track"><div class="teaching-dist-fill teaching-dist-fill-highschool"></div></div>
        </li>
      </ul>
    </div>
  </div>
  <p class="mb-0 mt-2 teaching-outcomes-sub">
    Audience split uses the current summary table plus additional-events breakdown from the teaching log.
  </p>
</div>

<div class="card mt-3 p-3">
  <h3 class="card-title font-weight-medium">Past Teaching Summary</h3>
  <p class="mb-2"><strong>Primary location:</strong> University of California, Irvine (most prior teaching roles).</p>
  <div class="table-responsive">
    <table class="table table-sm table-borderless">
      <thead>
        <tr>
          <th>Time</th>
          <th>Role</th>
          <th>Course / Description</th>
          <th>Level</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2024 Spring</td>
          <td>Instructor</td>
          <td>ICS 80: Data Science and AI/ML Using Workflows</td>
          <td>Undergrad</td>
          <td>42</td>
        </tr>
        <tr>
          <td rowspan="4">2018-2022</td>
          <td rowspan="4">TA (12 quarters)</td>
          <td>CS 222/122C/222P: Principles of Data Management (4 quarters)</td>
          <td>Graduate</td>
          <td>134</td>
        </tr>
        <tr>
          <td>CS 122B: Projects in Databases and Web Applications (5 quarters)</td>
          <td>Upper-Div</td>
          <td>1,126</td>
        </tr>
        <tr>
          <td>CS 141: Concepts of Programming Languages I</td>
          <td>Upper-Div</td>
          <td>304</td>
        </tr>
        <tr>
          <td>ICS 51: Introduction to Computer Organization</td>
          <td>Undergrad</td>
          <td>232</td>
        </tr>
        <tr>
          <td rowspan="3">2016-2018</td>
          <td rowspan="3">Tutor (5 quarters)</td>
          <td>ICS 31, 32, 33: Intro to Programming, Intermediate Programming, and Software Libraries</td>
          <td>Undergrad</td>
          <td>300</td>
        </tr>
        <tr>
          <td>ICS 45J: Programming in Java as a Second Language</td>
          <td>Undergrad</td>
          <td>150</td>
        </tr>
        <tr>
          <td>ICS 46: Data Structure Implementation and Analysis</td>
          <td>Undergrad</td>
          <td>200</td>
        </tr>
        <tr>
          <td>2018-2024</td>
          <td>Instructor / Lecturer / Mentor</td>
          <td>Additional Educational Events</td>
          <td>High school / College / Undergrad</td>
          <td>143</td>
        </tr>
      </tbody>
    </table>
  </div>
  <ul class="mb-0">
    <li>Student numbers are aggregated across multiple quarters.</li>
    <li>Estimated values are used when exact counts are unavailable.</li>
  </ul>
</div>

<div class="card mt-3 p-3">
  <h3 class="card-title font-weight-medium">Past Teaching Log</h3>
  <ul class="card-text font-weight-light list-group list-group-flush teaching-log-list">
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2024 Fall</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Workshop Instructor</div><div class="teaching-log-location">Cerritos College, Norwalk, CA, United States</div></div><div class="teaching-log-course"><div>Workshop of Data Science for Everyone 2024</div><div class="teaching-log-note">Two-day workshop for non-CS learners; 59 attendees.</div></div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2024 Spring</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Associate Instructor (Lecturer)</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course"><div>ICS 80: Data Science and AI/ML Using Workflows (<a href="https://canvas.eee.uci.edu/courses/63639">Syllabus</a>)</div><div class="teaching-log-note">New course design for non-CS students; 42 enrolled.</div></div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2023 Summer</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Lecturer</div><div class="teaching-log-location">DS4ALL Program</div></div><div class="teaching-log-course"><div>DS4ALL: NSF-funded summer program</div><div class="teaching-log-note">27 high school attendees.</div></div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2022 Winter</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">CS 222/122C - Principles of Data Management</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2021 Fall</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">CS 122B - Projects in Databases and Web Applications</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2021 Spring</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">CS 122B - Projects in Databases and Web Applications</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2021 Winter</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">ICS 51 - Introduction to Computer Organization</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2020 Fall</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">CS 222/122C - Principles of Data Management</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2020 Spring</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">CS 122B - Projects in Databases and Web Applications</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2020 Winter</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">CS 222/122C - Principles of Data Management</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2020 Winter</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Lecturer</div><div class="teaching-log-location">Chinese Union of CS</div></div><div class="teaching-log-course"><div>Review sessions for undergraduate students</div><div class="teaching-log-note">32 attendees.</div></div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2019 Fall</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">CS 222/122C - Principles of Data Management</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2019 Spring</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">CS 122B - Projects in Databases and Web Applications</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2019 Winter</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">CS 122B - Projects in Databases and Web Applications</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2018 Fall</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">CS 141 - Concepts of Programming Languages I</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2018 Spring</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Teaching Assistant</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">CS 122B - Projects in Databases and Web Applications</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2018 Winter</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Mentor</div><div class="teaching-log-location">Yorba Linda High School, Yorba Linda, CA, United States</div></div><div class="teaching-log-course"><div>Dreams for Schools APPJAM+</div></div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2018 Winter</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Tutor</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">ICS 46 - Data Structure Implementation and Analysis</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2017 Fall</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Tutor</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">ICS 45J - Programming in Java as a Second Language</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2017 Spring</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Tutor</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">ICS 33 - Intermediate Programming</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2017 Winter</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Tutor</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">ICS 32 - Programming with Software Libraries</div></div></li>
    <li class="list-group-item teaching-log-row"><div class="teaching-log-grid"><div class="teaching-log-time">2016 Fall</div><div class="teaching-log-roleloc"><div class="teaching-log-role">Tutor</div><div class="teaching-log-location">University of California, Irvine, CA, United States</div></div><div class="teaching-log-course">ICS 31 - Introduction to Programming</div></div></li>
  </ul>
</div>

<div class="card mt-3 p-3">
  <h3 class="card-title font-weight-medium">Mentoring Outcomes</h3>
  <div class="mentoring-outcomes-grid">
    <div class="mentoring-outcomes-panel">
      <div class="mentoring-section-label">Mentees by Academic Year</div>
      <ul class="mentoring-year-list">
        <li class="mentoring-year-item">
          <div class="mentoring-row-head"><span>2023-2024</span><span>4</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-year-2023"></div></div>
        </li>
        <li class="mentoring-year-item">
          <div class="mentoring-row-head"><span>2022-2023</span><span>10</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-year-2022"></div></div>
        </li>
        <li class="mentoring-year-item">
          <div class="mentoring-row-head"><span>2021-2022</span><span>7</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-year-2021"></div></div>
        </li>
        <li class="mentoring-year-item">
          <div class="mentoring-row-head"><span>2020-2021</span><span>6</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-year-2020"></div></div>
        </li>
        <li class="mentoring-year-item">
          <div class="mentoring-row-head"><span>2019-2020</span><span>16</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-year-2019"></div></div>
        </li>
      </ul>
    </div>
    <div class="mentoring-outcomes-panel">
      <div class="mentoring-section-label">Destination School Distribution</div>
      <ul class="mentoring-school-list">
        <li class="mentoring-school-item">
          <div class="mentoring-row-head"><span>UCI</span><span>4</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-school-uci"></div></div>
        </li>
        <li class="mentoring-school-item">
          <div class="mentoring-row-head"><span>CMU</span><span>4</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-school-cmu"></div></div>
        </li>
        <li class="mentoring-school-item">
          <div class="mentoring-row-head"><span>UCSD</span><span>2</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-school-ucsd"></div></div>
        </li>
        <li class="mentoring-school-item">
          <div class="mentoring-row-head"><span>UIUC, UW, NYU, UCLA, Brown, Cornell, UCD, Berkeley, UChicago, HKPU</span><span>1 each</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-school-others"></div></div>
        </li>
      </ul>
    </div>
    <div class="mentoring-outcomes-panel">
      <div class="mentoring-section-label">Mentee Degree Type Distribution</div>
      <ul class="mentoring-degree-list">
        <li class="mentoring-degree-item">
          <div class="mentoring-row-head"><span>Undergraduate</span><span>33 (76.7%)</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-degree-undergrad"></div></div>
        </li>
        <li class="mentoring-degree-item">
          <div class="mentoring-row-head"><span>Master</span><span>5 (11.6%)</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-degree-ms"></div></div>
        </li>
        <li class="mentoring-degree-item">
          <div class="mentoring-row-head"><span>Ph.D.</span><span>5 (11.6%)</span></div>
          <div class="mentoring-track"><div class="mentoring-fill mentoring-fill-degree-phd"></div></div>
        </li>
      </ul>
    </div>
  </div>
  <div class="mentoring-note">
    Based on the mentoring records listed below (2019-2024). Destination-school counts use explicitly labeled placements in the log.
  </div>
</div>

<div class="card mt-3 p-3">
  <h3 class="card-title font-weight-medium">Mentor</h3>
  <h5>Research Mentoring (2019 - Present)</h5>
  <p class="mb-2">University of California, Irvine, CA, United States</p>
  <ul>
    <li><strong>PhD students</strong>
      <ul>
        <li><strong>2023-2024</strong>: Raj Mohanty, Jiadong Bai, Shagoto Rahman Shrestho</li>
        <li><strong>2022-2023</strong>: Xinyuan Lin, Yunyan Ding</li>
      </ul>
    </li>
    <li><strong>Master students</strong>
      <ul>
        <li><strong>2022-2023</strong>: Aditya Verma, Sreetej Reddy, Dhruv Raipure, Jiaxi Chen</li>
        <li><strong>2019-2020</strong>: Yang Cao</li>
      </ul>
    </li>
    <li><strong>Undergraduate students</strong>
      <ul>
        <li><strong>2023-2024</strong>: Kevin Wu</li>
        <li><strong>2022-2023</strong>: Chengxi Li, Ethan Wong, Tianyun Yuan, Tony Liu</li>
        <li><strong>2021-2022</strong>: Zhen Guan, Jiashu Zhang, Yinan Zhou, Andrew Li, Eric Peng, Jiyang Wu, Zeyu Li</li>
        <li><strong>2020-2021</strong>: Chen He, Bihao Xu, Conghuai Tan, Make Tao, Mingshuo Liu, Qifan Yu</li>
        <li><strong>2019-2020</strong>: Dayue Bai, Yinan Zhou, Shiqi Wu, Christine Xinrong Huang, Tianran Liu, Yutong Wang, Tingxuan Gu, Yichi Zhang, Xinyue Han, Qiaonan Huang (Hugo), Yuan Fu, Yuqi Huai, Quanzhen Du, Shiling (Scarlett) Zhang, Zeyad Kelani</li>
      </ul>
    </li>
  </ul>
</div>

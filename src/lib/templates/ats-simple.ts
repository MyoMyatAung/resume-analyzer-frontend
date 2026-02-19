/**
 * ATS-Simple Template
 * Clean, minimal design optimized for ATS parsing
 * Simple fonts, no graphics, single column layout
 */
export const atsSimpleTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{fullName}} - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #333;
      max-width: 8.5in;
      margin: 0 auto;
    }
    
    .header {
      text-align: left;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #333;
    }
    
    .name {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    
    .contact-info {
      font-size: 10pt;
      color: #555;
    }
    
    .contact-info span {
      margin: 0 8px;
    }
    
    .section {
      margin-bottom: 18px;
    }
    
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #333;
      padding-bottom: 3px;
      margin-bottom: 10px;
    }
    
    .summary {
      margin-bottom: 18px;
    }
    
    .experience-item, .education-item, .project-item {
      margin-bottom: 15px;
    }
    
    .job-header, .edu-header, .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }
    
    .job-title, .degree, .project-name {
      font-weight: bold;
    }
    
    .company, .institution {
      font-style: italic;
    }
    
    .date {
      font-size: 10pt;
      color: #555;
    }
    
    .location {
      font-size: 10pt;
      color: #666;
    }
    
    ul {
      margin-left: 20px;
      margin-top: 5px;
    }
    
    li {
      margin-bottom: 3px;
    }
    
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .skill-category {
      margin-bottom: 8px;
    }
    
    .skill-category-title {
      font-weight: bold;
      font-size: 10pt;
    }
    
    .certifications-list {
      list-style: none;
      margin-left: 0;
    }
    
    .cert-item {
      margin-bottom: 5px;
    }
    
    .link {
      color: #333;
      text-decoration: none;
    }
  <style>
    .target-title {
      font-size: 14pt;
      color: #555;
      margin-top: -5px;
      margin-bottom: 10px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <header class="header">
    <h1 class="name">{{fullName}}</h1>
    {{#if targetTitle}}<div class="target-title">{{targetTitle}}</div>{{/if}}
    <div class="contact-info">
      <span>{{email}}</span>
      {{#if phone}}<span>•</span><span>{{phone}}</span>{{/if}}
      {{#if location}}<span>•</span><span>{{location}}</span>{{/if}}
      {{#if linkedin}}<span>•</span><span>{{linkedin}}</span>{{/if}}
      {{#if github}}<span>•</span><span>{{github}}</span>{{/if}}
      {{#if website}}<span>•</span><span>{{website}}</span>{{/if}}
    </div>
  </header>
  
  {{#if summary}}
  <section class="section summary">
    <h2 class="section-title">Professional Summary</h2>
    <p>{{summary}}</p>
  </section>
  {{/if}}
  
  {{#hasItems experiences}}
  <section class="section">
    <h2 class="section-title">Professional Experience</h2>
    {{#each experiences}}
    <div class="experience-item">
      <div class="job-header">
        <div>
          <span class="job-title">{{position}}</span>
          <span class="company"> | {{company}}</span>
          {{#if location}}<span class="location"> | {{location}}</span>{{/if}}
        </div>
        <span class="date">{{formatDate startDate}} - {{#if isCurrent}}Present{{else}}{{formatDate endDate}}{{/if}}</span>
      </div>
      {{#hasItems responsibilities}}
      <ul>
        {{#each responsibilities}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
      {{/hasItems}}
      {{#hasItems achievements}}
      <ul>
        {{#each achievements}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
      {{/hasItems}}
    </div>
    {{/each}}
  </section>
  {{/hasItems}}
  
  {{#hasItems education}}
  <section class="section">
    <h2 class="section-title">Education</h2>
    {{#each education}}
    <div class="education-item">
      <div class="edu-header">
        <div>
          <span class="degree">{{degree}}</span>
          <span class="institution"> | {{institution}}</span>
          {{#if location}}<span class="location"> | {{location}}</span>{{/if}}
        </div>
        <span class="date">{{formatDate startDate}} - {{#if endDate}}{{formatDate endDate}}{{else}}Present{{/if}}</span>
      </div>
      {{#if gpa}}<div>GPA: {{gpa}}</div>{{/if}}
      {{#if honors}}<div>{{honors}}</div>{{/if}}
    </div>
    {{/each}}
  </section>
  {{/hasItems}}
  
  <section class="section">
    <h2 class="section-title">Skills</h2>
    {{#hasItems skills.technical}}
    <div class="skill-category">
      <span class="skill-category-title">Technical:</span> {{join skills.technical ", "}}
    </div>
    {{/hasItems}}
    {{#hasItems skills.soft}}
    <div class="skill-category">
      <span class="skill-category-title">Soft Skills:</span> {{join skills.soft ", "}}
    </div>
    {{/hasItems}}
    {{#hasItems skills.languages}}
    <div class="skill-category">
      <span class="skill-category-title">Languages:</span> {{join skills.languages ", "}}
    </div>
    {{/hasItems}}
  </section>
  
  {{#hasItems projects}}
  <section class="section">
    <h2 class="section-title">Projects</h2>
    {{#each projects}}
    <div class="project-item">
      <div class="project-header">
        <span class="project-name">{{name}}</span>
        {{#if link}}<span class="link"> | {{link}}</span>{{/if}}
      </div>
      <p>{{description}}</p>
      <div><strong>Technologies:</strong> {{join technologies ", "}}</div>
      {{#hasItems highlights}}
      <ul>
        {{#each highlights}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
      {{/hasItems}}
    </div>
    {{/each}}
  </section>
  {{/hasItems}}
  
  {{#hasItems certifications}}
  <section class="section">
    <h2 class="section-title">Certifications</h2>
    <ul class="certifications-list">
      {{#each certifications}}
      <li class="cert-item">
        <strong>{{name}}</strong> - {{issuer}} ({{formatDate issueDate}})
        {{#if credentialId}} | ID: {{credentialId}}{{/if}}
      </li>
      {{/each}}
    </ul>
  </section>
  {{/hasItems}}
</body>
</html>
`;

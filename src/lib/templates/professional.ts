/**
 * Professional Template
 * Classic professional design with subtle styling
 * Two-tone header, clean typography
 */
export const professionalTemplate = `
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
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #2c3e50;
      padding: 0.75in;
    }
    
    .header {
      background: linear-gradient(135deg, #2c3e50 100%, #34495e 100%);
      color: white;
      padding: 0.75in;
    }
    
    .name {
      font-size: 28pt;
      font-weight: normal;
      letter-spacing: 2px;
      margin-bottom: 10px;
    }
    
    .contact-info {
      font-size: 10pt;
      opacity: 0.9;
    }
    
    .contact-info a {
      color: white;
      text-decoration: none;
    }
    
    .contact-item {
      display: inline-block;
      margin-right: 20px;
    }
    
    .section {
      margin-bottom: 22px;
    }
    
    .section-title {
      font-size: 13pt;
      font-weight: bold;
      color: #2c3e50;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 2px solid #3498db;
      padding-bottom: 5px;
      margin-bottom: 12px;
    }
    
    .summary-section {
      margin-bottom: 20px;
    }
    
    .summary {
      font-style: italic;
      color: #555;
      padding: 10px 15px;
      background: #f8f9fa;
      border-left: 3px solid #3498db;
    }
    
    .experience-item, .education-item, .project-item {
      margin-bottom: 18px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .experience-item:last-child, .education-item:last-child, .project-item:last-child {
      border-bottom: none;
    }
    
    .job-header, .edu-header {
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    
    .job-title, .degree {
      font-size: 12pt;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .company, .institution {
      font-size: 11pt;
      color: #3498db;
    }
    
    .meta-line {
      font-size: 10pt;
      color: #7f8c8d;
      margin-bottom: 8px;
    }
    
    ul {
      margin-left: 20px;
      margin-top: 8px;
    }
    
    li {
      margin-bottom: 5px;
      color: #444;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .skill-category {
      background: #f8f9fa;
      padding: 12px 15px;
      border-radius: 5px;
    }
    
    .skill-category-title {
      font-weight: bold;
      color: #2c3e50;
      font-size: 10pt;
      text-transform: uppercase;
      margin-bottom: 8px;
      display: block;
    }
    
    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .skill-tag {
      background: white;
      border: 1px solid #ddd;
      padding: 3px 8px;
      font-size: 9pt;
      border-radius: 3px;
    }
    
    .project-name {
      font-weight: bold;
      color: #2c3e50;
    }
    
    .project-link {
      color: #3498db;
      text-decoration: none;
      font-size: 10pt;
    }
    
    .tech-stack {
      font-size: 10pt;
      color: #7f8c8d;
      margin: 5px 0;
    }
    
    .cert-item {
      padding: 8px 0;
      border-bottom: 1px dashed #ecf0f1;
      display: flex;
      justify-content: space-between;
    }
    
    .cert-item:last-child {
      border-bottom: none;
    }
    
    .cert-name {
      font-weight: bold;
    }
    
    .cert-issuer {
      color: #3498db;
    }
    
    .cert-date {
      color: #7f8c8d;
      font-size: 10pt;
    }
    .target-title {
      font-size: 12pt;
      opacity: 0.8;
      margin-top: -5px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <header class="header">
    <h1 class="name">{{fullName}}</h1>
    {{#if targetTitle}}<div class="target-title">{{targetTitle}}</div>{{/if}}
    <div class="contact-info">
      <span class="contact-item">{{email}}</span>
      {{#if phone}}<span class="contact-item">{{phone}}</span>{{/if}}
      {{#if location}}<span class="contact-item">{{location}}</span>{{/if}}
      {{#if linkedin}}<span class="contact-item">{{linkedin}}</span>{{/if}}
      {{#if github}}<span class="contact-item">{{github}}</span>{{/if}}
      {{#if website}}<span class="contact-item">{{website}}</span>{{/if}}
    </div>
  </header>
  
  {{#if summary}}
  <div class="summary-section">
    <div class="summary">
      {{summary}}
    </div>
  </div>
  {{/if}}
  
  {{#hasItems experiences}}
  <section class="section">
    <h2 class="section-title">Professional Experience</h2>
    {{#each experiences}}
    <div class="experience-item">
      <div class="job-header">
        <div class="job-title">{{position}}</div>
        <div class="company">{{company}}</div>
      </div>
      <div class="meta-line">
        {{#if location}}{{location}} | {{/if}}
        {{formatDate startDate}} - {{#if isCurrent}}Present{{else}}{{formatDate endDate}}{{/if}}
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
        <div class="degree">{{degree}}</div>
        <div class="institution">{{institution}}</div>
      </div>
      <div class="meta-line">
        {{#if location}}{{location}} | {{/if}}
        {{formatDate startDate}} - {{#if endDate}}{{formatDate endDate}}{{else}}Present{{/if}}
        {{#if gpa}} | GPA: {{gpa}}{{/if}}
      </div>
      {{#if honors}}<div>{{honors}}</div>{{/if}}
    </div>
    {{/each}}
  </section>
  {{/hasItems}}
  
  <section class="section">
    <h2 class="section-title">Skills</h2>
    <div class="skills-grid">
      {{#hasItems skills.technical}}
      <div class="skill-category">
        <span class="skill-category-title">Technical Skills</span>
        <div class="skill-tags">
          {{#each skills.technical}}
          <span class="skill-tag">{{this}}</span>
          {{/each}}
        </div>
      </div>
      {{/hasItems}}
      {{#hasItems skills.soft}}
      <div class="skill-category">
        <span class="skill-category-title">Soft Skills</span>
        <div class="skill-tags">
          {{#each skills.soft}}
          <span class="skill-tag">{{this}}</span>
          {{/each}}
        </div>
      </div>
      {{/hasItems}}
      {{#hasItems skills.languages}}
      <div class="skill-category">
        <span class="skill-category-title">Languages</span>
        <div class="skill-tags">
          {{#each skills.languages}}
          <span class="skill-tag">{{this}}</span>
          {{/each}}
        </div>
      </div>
      {{/hasItems}}
    </div>
  </section>
  
  {{#hasItems projects}}
  <section class="section">
    <h2 class="section-title">Projects</h2>
    {{#each projects}}
    <div class="project-item">
      <div class="job-header">
        <span class="project-name">{{name}}</span>
        {{#if link}}<a href="{{link}}" class="project-link"> | {{link}}</a>{{/if}}
      </div>
      <p style="margin-bottom: 8px;">{{description}}</p>
      <div class="tech-stack"><strong>Technologies:</strong> {{join technologies ", "}}</div>
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
    {{#each certifications}}
    <div class="cert-item">
      <div>
        <span class="cert-name">{{name}}</span> - 
        <span class="cert-issuer">{{issuer}}</span>
      </div>
      <span class="cert-date">{{formatDate issueDate}}</span>
    </div>
    {{/each}}
  </section>
  {{/hasItems}}
</body>
</html>
`;

import Handlebars from 'handlebars';
import { atsSimpleTemplate } from './ats-simple';
import { professionalTemplate } from './professional';
import { modernTemplate } from './modern';
import type { GeneratedResume } from '@/types/resume-builder';

// Register Handlebars helpers
// Note: We're reusing the same helpers as the backend generator to ensure consistency
Handlebars.registerHelper('formatDate', (dateString: string) => {
  if (!dateString) return '';
  if (dateString.toLowerCase() === 'present') return 'Present';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
});

Handlebars.registerHelper('join', (array: string[], separator: string) => {
  if (!Array.isArray(array)) return '';
  return array.join(typeof separator === 'string' ? separator : ', ');
});

Handlebars.registerHelper('ifCond', function (
  this: any,
  v1: any,
  operator: string,
  v2: any,
  options: Handlebars.HelperOptions
) {
  switch (operator) {
    case '==':
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case '===':
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case '||':
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    case '&&':
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

Handlebars.registerHelper('hasItems', function (
  this: any,
  array: any[],
  options: Handlebars.HelperOptions
) {
  if (Array.isArray(array) && array.length > 0) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// Template registry
const templates: Record<string, string> = {
  'ats-simple': atsSimpleTemplate,
  'professional': professionalTemplate,
  'modern': modernTemplate,
};

/**
 * Render a resume using a template
 */
export function renderResume(resume: GeneratedResume, templateId: string): string {
  const templateHtml = templates[templateId] || templates['ats-simple'];
  const compiled = Handlebars.compile(templateHtml);
  return compiled(resume);
}

/**
 * Get the list of available template IDs
 */
export function getAvailableTemplateIds(): string[] {
  return Object.keys(templates);
}

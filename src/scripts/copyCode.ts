/**
 * Add copy buttons to all code blocks
 */
export function initCopyCodeButtons() {
  if (typeof document === 'undefined') return;

  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach((codeElement) => {
    const pre = codeElement.parentElement;
    if (!pre || pre.classList.contains('has-copy-button')) return;
    
    pre.classList.add('has-copy-button', 'group', 'relative');
    
    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.textContent = 'Copy';
    
    button.addEventListener('click', async () => {
      const text = codeElement.textContent || '';
      
      try {
        await navigator.clipboard.writeText(text);
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('bg-green-600', 'hover:bg-green-600');
        
        setTimeout(() => {
          button.textContent = originalText || 'Copy';
          button.classList.remove('bg-green-600', 'hover:bg-green-600');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        button.textContent = 'Failed';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      }
    });
    
    pre.appendChild(button);
  });
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyCodeButtons);
  } else {
    initCopyCodeButtons();
  }
  
  // Re-run after view transitions
  document.addEventListener('astro:page-load', initCopyCodeButtons);
}

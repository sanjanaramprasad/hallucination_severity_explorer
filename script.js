// Landing page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
              const navHeight = document.querySelector('.navbar').offsetHeight;
              const targetPosition = targetElement.offsetTop - navHeight;
              
              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });

  // Add scroll effect to navbar
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
          // Scrolling down
          navbar.style.transform = 'translateY(-100%)';
      } else {
          // Scrolling up
          navbar.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
  });

  // Add animation to preview tooltip on hover
  const highlightDemo = document.querySelector('.highlight-demo');
  const previewTooltip = document.querySelector('.preview-tooltip');
  
  if (highlightDemo && previewTooltip) {
      highlightDemo.addEventListener('mouseenter', function() {
          previewTooltip.style.transform = 'scale(1.05)';
          previewTooltip.style.transition = 'transform 0.3s ease';
      });
      
      highlightDemo.addEventListener('mouseleave', function() {
          previewTooltip.style.transform = 'scale(1)';
      });
  }

  // Animate rating dots in the preview
  const dots = document.querySelectorAll('.preview-tooltip .dot');
  if (dots.length > 0) {
      setInterval(() => {
          dots.forEach((dot, index) => {
              setTimeout(() => {
                  dot.style.transform = 'scale(1.2)';
                  setTimeout(() => {
                      dot.style.transform = 'scale(1)';
                  }, 200);
              }, index * 100);
          });
      }, 3000);
  }

  // Add entrance animations
  const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
          }
      });
  }, observerOptions);

  // Observe about cards
  const aboutCards = document.querySelectorAll('.about-card');
  aboutCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
      observer.observe(card);
  });

  // Add some interactive elements
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
      ctaButton.addEventListener('mouseenter', function() {
          this.style.background = 'rgba(255, 255, 255, 0.4)';
      });
      
      ctaButton.addEventListener('mouseleave', function() {
          this.style.background = 'rgba(255, 255, 255, 0.2)';
      });
  }
});
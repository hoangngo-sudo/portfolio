import { animate } from "framer-motion";

/**
 * Smooth-scroll to a target Y position using framer-motion spring animation.
 */
export function smoothScrollTo(targetY: number) {
  animate(window.scrollY, targetY, {




    onUpdate: (value) => window.scrollTo(0, value),




    type: "spring",




    visualDuration: 0.33,




    bounce: 0.2









    














    









    














    









    














    









    














    









    














    

    
  });
}

/**
 * Smooth-scroll to a DOM element by ID using framer-motion spring animation.
 */
export function smoothScrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  smoothScrollTo(window.scrollY + rect.top);
}

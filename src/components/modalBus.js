let authListeners = [];

export function openAuthModal() {
  authListeners.forEach((l) => l());
}

export function onAuthModalOpen(fn) {
  authListeners.push(fn);
  return () => {
    authListeners = authListeners.filter((l) => l !== fn);
  };
}

function DownloadAppButton() {
  const handleInstall = async () => {
    if (!window.deferredPrompt) {
      alert("Install not available yet");
      return;
    }

    // ✅ THIS LINE IS THE KEY
    window.deferredPrompt.prompt();

    const { outcome } = await window.deferredPrompt.userChoice;
    console.log("User choice:", outcome);

    window.deferredPrompt = null;
  };

  return (
    
    <button
      onClick={handleInstall}
      className="px-4 py-2 bg-green-600 text-white rounded text-sm"
    >
        
      Download App
    </button>
  );
}

export default DownloadAppButton;

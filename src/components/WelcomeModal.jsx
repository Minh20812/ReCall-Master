import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the modal has been shown before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    // Set flag in localStorage to not show again in current session
    localStorage.setItem("hasSeenWelcome", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome to RecallMaster
          </DialogTitle>
          <DialogDescription className="pt-4 text-base">
            <div className="space-y-4">
              <p className="text-yellow-600 dark:text-yellow-500 font-medium">
                ⚠️ Important Notice:
              </p>
              <p>
                This is a demo version of RecallMaster. Before using the
                application, please ensure that the local server is running as
                it's not hosted 24/7.
              </p>
              <div className="bg-muted p-4 rounded-md">
                <a
                  href="https://server-recall-master.onrender.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 underline break-all"
                >
                  https://server-recall-master.onrender.com/
                </a>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Click the link above to activate the server. Please wait a
                  moment for the server to start up.
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose}>Got it, thanks!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;

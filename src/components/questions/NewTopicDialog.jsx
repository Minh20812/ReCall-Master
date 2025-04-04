import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTopicMutation } from "@/redux/api/topicApi";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const iconOptions = [
  "BookOpen",
  "FileText",
  "Briefcase",
  "Code",
  "Database",
  "Globe",
  "Home",
  "Image",
  "Layers",
  "Mail",
  "Map",
  "MessageCircle",
  "Music",
  "PenTool",
  "Settings",
  "Star",
  "Video",
  "Users",
];

export const NewTopicDialog = ({
  isOpen,
  setIsOpen,
  onTopicCreated,
  refetchTopics,
}) => {
  const [newTopicName, setNewTopicName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createTopic] = useCreateTopicMutation();

  const handleCreateTopic = async () => {
    if (!newTopicName.trim()) {
      toast.error("Topic name cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      const res = await createTopic({
        name: newTopicName.trim(),
        description: description.trim() || "Created from question editor", // Use default if empty
        icon: icon || "BookOpen", // Use default if not selected
      }).unwrap();

      console.log("Topic created:", res);

      if (onTopicCreated) {
        onTopicCreated(res._id);
      }

      // Reset form
      setNewTopicName("");
      setDescription("");
      setIcon("");
      setIsOpen(false);

      if (refetchTopics) {
        refetchTopics(); // Refresh topics list
      }

      toast.success(`Topic "${newTopicName}" successfully created`);
    } catch (error) {
      console.error("Error creating topic:", error);
      toast.error(error.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Only trigger on Enter without Shift (to allow multiline in textarea)
      if (e.target.id !== "description") {
        e.preventDefault();
        handleCreateTopic();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
          <DialogDescription>
            Enter details for your new topic
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Topic Name *</Label>
            <Input
              id="name"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter topic name"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter topic description (optional)"
              disabled={isLoading}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to use default description
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon (optional)" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((iconOption) => (
                  <SelectItem key={iconOption} value={iconOption}>
                    {iconOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Leave empty to use default icon (BookOpen)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateTopic} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Topic"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

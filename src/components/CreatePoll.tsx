import { useState } from "react";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Vote, Loader2 } from "lucide-react";

// Replace with your deployed package ID
const PACKAGE_ID = "0x0"; // Update this after deployment

export function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isCreating, setIsCreating] = useState(false);
  
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const createPoll = async () => {
    if (!question.trim()) {
      toast.error("Please enter a poll question");
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error("Please provide at least 2 options");
      return;
    }

    setIsCreating(true);

    try {
      const transaction = new Transaction();
      
      // Get the clock object
      transaction.moveCall({
        target: `${PACKAGE_ID}::voting::create_poll`,
        arguments: [
          transaction.pure.string(question.trim()),
          transaction.pure.vector("string", validOptions.map(opt => opt.trim())),
          transaction.object("0x6"), // Clock object
        ],
      });

      signAndExecuteTransaction(
        { transaction },
        {
          onSuccess: (result) => {
            console.log("Poll created successfully:", result);
            
            toast.success("Poll created successfully!", {
              description: "Check the console for transaction details and copy the Poll Object ID to share with voters",
              duration: 5000,
            });

            // Reset form
            setQuestion("");
            setOptions(["", ""]);
          },
          onError: (error) => {
            console.error("Error creating poll:", error);
            toast.error("Failed to create poll", {
              description: error.message || "Please try again",
            });
          },
        }
      );
    } catch (error) {
      console.error("Error creating poll:", error);
      toast.error("Failed to create poll");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Vote className="h-5 w-5 text-primary" />
          <span>Create New Poll</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="question">Poll Question</Label>
          <Textarea
            id="question"
            placeholder="What's your question? e.g., What's the best programming language?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-4">
          <Label>Poll Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full vote-option-${index} flex-shrink-0`} />
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1"
              />
              {options.length > 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {options.length < 5 && (
            <Button
              variant="outline"
              onClick={addOption}
              className="w-full border-dashed hover:bg-primary/5"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          )}
        </div>

        <Button
          onClick={createPoll}
          disabled={isCreating}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary"
          size="lg"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Poll...
            </>
          ) : (
            <>
              <Vote className="mr-2 h-4 w-4" />
              Create Poll
            </>
          )}
        </Button>

        {PACKAGE_ID === "0x0" && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning-foreground">
              ⚠️ <strong>Setup Required:</strong> Update the PACKAGE_ID in CreatePoll.tsx with your deployed package ID to enable poll creation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Vote, Loader2, Search, BarChart3 } from "lucide-react";

// Replace with your deployed package ID
const PACKAGE_ID = "0x0"; // Update this after deployment

interface PollData {
  question: string;
  options: string[];
  votes: number[];
  creator: string;
  created_ms: string;
}

export function VoteOnPoll() {
  const [pollId, setPollId] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pollData, setPollData] = useState<PollData | null>(null);

  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const loadPoll = async () => {
    if (!pollId.trim()) {
      toast.error("Please enter a Poll ID");
      return;
    }

    setIsLoading(true);
    try {
      const object = await suiClient.getObject({
        id: pollId.trim(),
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (object.data?.content && "fields" in object.data.content) {
        const fields = object.data.content.fields as any;
        
        setPollData({
          question: fields.question,
          options: fields.options,
          votes: fields.votes.map((v: string) => parseInt(v)),
          creator: fields.creator,
          created_ms: fields.created_ms,
        });

        toast.success("Poll loaded successfully!");
      } else {
        toast.error("Poll not found or invalid Poll ID");
      }
    } catch (error) {
      console.error("Error loading poll:", error);
      toast.error("Failed to load poll", {
        description: "Please check the Poll ID and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const vote = async () => {
    if (!selectedOption) {
      toast.error("Please select an option to vote");
      return;
    }

    setIsVoting(true);

    try {
      const transaction = new Transaction();
      
      transaction.moveCall({
        target: `${PACKAGE_ID}::voting::vote`,
        arguments: [
          transaction.object(pollId.trim()),
          transaction.pure.u64(parseInt(selectedOption)),
        ],
      });

      signAndExecuteTransaction(
        { transaction },
        {
          onSuccess: (result) => {
            console.log("Vote submitted successfully:", result);
            toast.success("Vote submitted successfully!", {
              description: "Your vote has been recorded on the blockchain",
            });

            // Reload poll data to show updated vote counts
            loadPoll();
            setSelectedOption("");
          },
          onError: (error) => {
            console.error("Error voting:", error);
            
            // Handle specific error codes
            let message = "Failed to submit vote";
            let description = error.message || "Please try again";
            
            if (error.message?.includes("2")) {
              message = "Already voted";
              description = "You have already voted on this poll";
            } else if (error.message?.includes("3")) {
              message = "Invalid option";
              description = "The selected option is not valid";
            }
            
            toast.error(message, { description });
          },
        }
      );
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to submit vote");
    } finally {
      setIsVoting(false);
    }
  };

  const totalVotes = pollData?.votes.reduce((sum, count) => sum + count, 0) || 0;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Vote className="h-5 w-5 text-primary" />
            <span>Vote on Poll</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="pollId">Poll ID</Label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                id="pollId"
                placeholder="Enter Poll Object ID"
                value={pollId}
                onChange={(e) => setPollId(e.target.value)}
                className="font-mono text-xs sm:text-sm flex-1"
              />
              <Button
                onClick={loadPoll}
                disabled={isLoading}
                variant="outline"
                className="px-4 w-full sm:w-auto justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2 sm:mr-0" />
                ) : (
                  <Search className="h-4 w-4 mr-2 sm:mr-0" />
                )}
                <span className="sm:hidden">Load Poll</span>
              </Button>
            </div>
          </div>

          {PACKAGE_ID === "0x0" && (
            <div className="p-3 sm:p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-xs sm:text-sm text-warning-foreground leading-relaxed">
                ⚠️ <strong>Setup Required:</strong> Update the PACKAGE_ID in VoteOnPoll.tsx with your deployed package ID to enable voting.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {pollData && (
        <Card className="bg-gradient-card border-border/50 shadow-lg animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Poll Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 leading-tight">{pollData.question}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 text-xs sm:text-sm text-muted-foreground">
                <span>Total votes: {totalVotes}</span>
                <span className="hidden sm:inline mx-2">•</span>
                <span>Created by: {pollData.creator.slice(0, 8)}...</span>
              </div>
            </div>

            <div className="space-y-4">
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                {pollData.options.map((option, index) => {
                  const voteCount = pollData.votes[index];
                  const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start sm:items-center space-x-3 p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-0.5 sm:mt-0" />
                        <div className="flex-1 min-w-0">
                          <Label
                            htmlFor={`option-${index}`}
                            className="cursor-pointer font-medium text-sm sm:text-base leading-tight block"
                          >
                            {option}
                          </Label>
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground mt-1 sm:hidden">
                            <span>{voteCount} votes</span>
                            <span>({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{voteCount} votes</span>
                          <span>({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      
                      {totalVotes > 0 && (
                        <div className="ml-6 sm:ml-8 w-full bg-secondary rounded-full h-1.5 sm:h-2">
                          <div
                            className={`vote-option-${index} h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </RadioGroup>

              <Button
                onClick={vote}
                disabled={isVoting || !selectedOption}
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary py-3 sm:py-4"
                size="lg"
              >
                {isVoting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Vote...
                  </>
                ) : (
                  <>
                    <Vote className="mr-2 h-4 w-4" />
                    Submit Vote
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
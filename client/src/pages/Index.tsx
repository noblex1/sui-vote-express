import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletConnection } from "@/components/WalletConnection";
import { CreatePoll } from "@/components/CreatePoll";
import { VoteOnPoll } from "@/components/VoteOnPoll";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vote, Plus, BarChart3 } from "lucide-react";

const Index = () => {
  const account = useCurrentAccount();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-4 glow-primary">
              Sui Vote Express
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Create and participate in decentralized voting powered by Sui blockchain. 
              Transparent, secure, and tamper-proof voting for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Wallet Connection */}
          <div className="animate-slide-up">
            <WalletConnection />
          </div>

          {/* Main Features */}
          {account ? (
            <div className="animate-bounce-in">
              <Tabs defaultValue="vote" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur">
                  <TabsTrigger value="vote" className="flex items-center space-x-2">
                    <Vote className="h-4 w-4" />
                    <span>Vote on Poll</span>
                  </TabsTrigger>
                  <TabsTrigger value="create" className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Poll</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="vote" className="space-y-6">
                  <VoteOnPoll />
                </TabsContent>
                
                <TabsContent value="create" className="space-y-6">
                  <CreatePoll />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <div className="p-8 bg-muted/50 rounded-lg border border-border/50">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect to Get Started</h3>
                <p className="text-muted-foreground">
                  Connect your Sui wallet to create polls and participate in voting
                </p>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 pt-12 animate-fade-in">
            <div className="text-center p-6 bg-card/50 rounded-lg border border-border/50">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                <Vote className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">One Vote Per Address</h3>
              <p className="text-sm text-muted-foreground">
                Blockchain-enforced single voting prevents manipulation
              </p>
            </div>
            
            <div className="text-center p-6 bg-card/50 rounded-lg border border-border/50">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Results</h3>
              <p className="text-sm text-muted-foreground">
                See live vote counts and percentages as they happen
              </p>
            </div>
            
            <div className="text-center p-6 bg-card/50 rounded-lg border border-border/50">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Poll Creation</h3>
              <p className="text-sm text-muted-foreground">
                Create polls with up to 5 options in just a few clicks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

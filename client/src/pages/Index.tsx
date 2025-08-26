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
      <div className="bg-gradient-hero py-12 sm:py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 glow-primary leading-tight">
              Sui Vote Express
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-lg sm:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Create and participate in decentralized voting powered by Sui blockchain. 
              Transparent, secure, and tamper-proof voting for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Wallet Connection */}
          <div className="animate-slide-up">
            <WalletConnection />
          </div>

          {/* Main Features */}
          {account ? (
            <div className="animate-bounce-in">
              <Tabs defaultValue="vote" className="space-y-4 sm:space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur h-12 sm:h-14">
                  <TabsTrigger value="vote" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                    <Vote className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Vote on Poll</span>
                    <span className="xs:hidden">Vote</span>
                  </TabsTrigger>
                  <TabsTrigger value="create" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Create Poll</span>
                    <span className="xs:hidden">Create</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="vote" className="space-y-4 sm:space-y-6">
                  <VoteOnPoll />
                </TabsContent>
                
                <TabsContent value="create" className="space-y-4 sm:space-y-6">
                  <CreatePoll />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 animate-fade-in">
              <div className="p-6 sm:p-8 bg-muted/50 rounded-lg border border-border/50">
                <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">Connect to Get Started</h3>
                <p className="text-sm sm:text-base text-muted-foreground px-2 sm:px-0">
                  Connect your Sui wallet to create polls and participate in voting
                </p>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-12 animate-fade-in">
            <div className="text-center p-4 sm:p-6 bg-card/50 rounded-lg border border-border/50 hover:bg-card/70 transition-colors">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <Vote className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-2">One Vote Per Address</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Blockchain-enforced single voting prevents manipulation
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-card/50 rounded-lg border border-border/50 hover:bg-card/70 transition-colors">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-2">Real-time Results</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                See live vote counts and percentages as they happen
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-card/50 rounded-lg border border-border/50 hover:bg-card/70 transition-colors sm:col-span-2 lg:col-span-1">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-2">Easy Poll Creation</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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

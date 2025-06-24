import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { useSession } from "@/context/AuthContext";

const Dashboard = () => {
    const topSummaryCards = [
        { title: "Active Services", value: 1200 },
        { title: "Upcoming Appointments", value: 45 },
        { title: "Pending Tasks", value: 30 },
        { title: "Completed Tasks", value: 150 },
    ];

    const { userData } = useSession();
  return (
    <section className="">
      <VStack className="bg-[#F6F6F6] justify-between">
        <HStack className="p-4">
            <h1 className="text-2xl font-bold">Good Evening {userData?.firstName}!</h1>
        </HStack>
        <HStack className="">
            {topSummaryCards.map((card, index) => (
                <Card key={index} variant="outline" className="bg-white m-4 p-6 w-1/4">
                    <h2 className="text-xl font-semibold">{card.title}</h2>
                    <p className="text-2xl font-bold">{card.value}</p>
                </Card>
            ))}
        </HStack>
        
      </VStack>
    </section>
  );
};

export default Dashboard;
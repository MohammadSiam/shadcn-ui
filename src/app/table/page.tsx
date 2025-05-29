import { columns, Payment } from "./components/column";
import { DataTable } from "./components/data-table";

async function getData(): Promise<Payment[]> {
  return [
    { id: "1a", amount: 100, status: "pending", email: "user1@example.com" },
    { id: "2b", amount: 110, status: "success", email: "user2@example.com" },
    { id: "3c", amount: 120, status: "failed", email: "user3@example.com" },
    { id: "4d", amount: 130, status: "pending", email: "user4@example.com" },
    { id: "5e", amount: 140, status: "success", email: "user5@example.com" },
    { id: "6f", amount: 150, status: "failed", email: "user6@example.com" },
    { id: "7g", amount: 160, status: "pending", email: "user7@example.com" },
    { id: "8h", amount: 170, status: "success", email: "user8@example.com" },
    { id: "9i", amount: 180, status: "failed", email: "user9@example.com" },
    { id: "10j", amount: 190, status: "pending", email: "user10@example.com" },
    { id: "11k", amount: 200, status: "success", email: "user11@example.com" },
    { id: "12l", amount: 210, status: "failed", email: "user12@example.com" },
    { id: "13m", amount: 220, status: "pending", email: "user13@example.com" },
    { id: "14n", amount: 230, status: "success", email: "user14@example.com" },
    { id: "15o", amount: 240, status: "failed", email: "user15@example.com" },
    { id: "16p", amount: 250, status: "pending", email: "user16@example.com" },
    { id: "17q", amount: 260, status: "success", email: "user17@example.com" },
    { id: "18r", amount: 270, status: "failed", email: "user18@example.com" },
    { id: "19s", amount: 280, status: "pending", email: "user19@example.com" },
    { id: "20t", amount: 290, status: "success", email: "user20@example.com" },
    { id: "21u", amount: 300, status: "failed", email: "user21@example.com" },
    { id: "22v", amount: 310, status: "pending", email: "user22@example.com" },
    { id: "23w", amount: 320, status: "success", email: "user23@example.com" },
    { id: "24x", amount: 330, status: "failed", email: "user24@example.com" },
    { id: "25y", amount: 340, status: "pending", email: "user25@example.com" },
    { id: "26z", amount: 350, status: "success", email: "user26@example.com" },
    { id: "27aa", amount: 360, status: "failed", email: "user27@example.com" },
    { id: "28bb", amount: 370, status: "pending", email: "user28@example.com" },
    { id: "29cc", amount: 380, status: "success", email: "user29@example.com" },
    { id: "30dd", amount: 390, status: "failed", email: "user30@example.com" },
  ];
}
async function TableComponent() {
  const data = await getData();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default TableComponent;

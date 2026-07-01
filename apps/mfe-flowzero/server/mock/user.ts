import type { Application, Request, Response } from "express";

type UserVo = {
  id: string;
  bankId: string;
  userName: string;
  countryCode: string;
  email: string;
  roleName: string;
  status: string;
};

const WORKFLOW_BASE = "/api/ratan/api/v1";

const ROLES = ["APPROVER", "REVIEWER", "SUBMITTER", "ADMIN", "ANALYST", "MANAGER", "AUDITOR", "OPERATOR"];
const COUNTRIES = ["SG", "MY", "HK", "TH", "ID", "PH", "CN", "IN"];
const STATUSES = ["ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "INACTIVE"];

const FIRST_NAMES = [
  "Alice", "Bob", "Carol", "David", "Eve", "Frank", "Gloria", "Henry",
  "Iris", "Jack", "Karen", "Leo", "Mia", "Nathan", "Olivia", "Paul",
  "Quinn", "Rachel", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xander",
  "Yvonne", "Zach", "Amber", "Blake", "Chloe", "Derek", "Elena", "Felix",
  "Grace", "Hugo", "Isla", "James", "Kelly", "Liam", "Monica", "Noah",
  "Omar", "Penny", "Ravi", "Sara", "Tom", "Ursula", "Vera", "Will",
  "Xia", "Yuki",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis",
  "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White",
  "Harris", "Martin", "Lee", "Clark", "Lewis", "Walker", "Hall", "Allen",
  "Young", "King", "Wright", "Scott", "Green", "Baker", "Adams", "Nelson",
  "Carter", "Mitchell", "Parker", "Evans", "Edwards", "Collins", "Stewart",
  "Morris", "Rogers", "Reed", "Turner", "Phillips", "Campbell", "Morgan",
  "Cooper", "Bailey", "Bell", "Ward", "Cox", "Richardson",
];

const mockUsers: UserVo[] = Array.from({ length: 100 }, (_, i) => {
  const idx = i + 1;
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
  const userName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${idx > FIRST_NAMES.length ? idx : ""}`;
  return {
    id: `user_${String(idx).padStart(3, "0")}`,
    bankId: `B${String(idx).padStart(3, "0")}`,
    userName,
    countryCode: COUNTRIES[i % COUNTRIES.length],
    email: `${userName}@sc.com`,
    roleName: ROLES[i % ROLES.length],
    status: STATUSES[i % STATUSES.length],
  };
});

export const registerUserMockRoutes = (app: Application) => {
  // 1. Get user by bankId
  app.get(
    `${WORKFLOW_BASE}/user/bankId/:bankId`,
    (req: Request, res: Response) => {
      const user = mockUsers.find((u) => u.bankId === req.params.bankId);
      if (!user) {
        res.status(404).send({ message: "user not found" });
        return;
      }
      res.send(user);
    }
  );

  // 2. Get user by email
  app.get(
    `${WORKFLOW_BASE}/user/email/:email`,
    (req: Request, res: Response) => {
      const user = mockUsers.find((u) => u.email === req.params.email);
      if (!user) {
        res.status(404).send({ message: "user not found" });
        return;
      }
      res.send(user);
    }
  );

  // 3. Get users by country code
  app.get(
    `${WORKFLOW_BASE}/user/country/:countryCode`,
    (req: Request, res: Response) => {
      const users = mockUsers.filter(
        (u) => u.countryCode === req.params.countryCode
      );
      res.send(users);
    }
  );

  // 4. Get users by user name (fuzzy search)
  app.get(
    `${WORKFLOW_BASE}/user/userName/:userName`,
    (req: Request, res: Response) => {
      const keyword = req.params.userName.toLowerCase();
      const users = mockUsers.filter((u) =>
        u.userName.toLowerCase().includes(keyword)
      );
      res.send(users);
    }
  );

  // 5. Get all users
  app.get(`${WORKFLOW_BASE}/user/all`, (_req: Request, res: Response) => {
    res.send(mockUsers);
  });

  // 6. Search users — supports userName, bankId, roleName query params (case-insensitive contains)
  app.get(`${WORKFLOW_BASE}/user/search`, (req: Request, res: Response) => {
    const { userName, bankId, roleName } = req.query as Record<string, string | undefined>;
    let result = [...mockUsers];
    if (roleName) {
      result = result.filter((u) =>
        u.roleName.toLowerCase().includes(roleName.toLowerCase())
      );
    }
    if (userName || bankId) {
      const term = (userName || bankId || "").toLowerCase();
      result = result.filter(
        (u) =>
          u.userName.toLowerCase().includes(term) ||
          u.bankId.toLowerCase().includes(term)
      );
    }
    res.send(result);
  });
};

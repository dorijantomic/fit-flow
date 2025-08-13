'use server';

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

class UserDAO {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  public async getUser() {
    return await prisma.user.findUnique({
      where: { id: this.userId },
    });
  }
}

export async function getUserAction() {
    const session = await getSession();
    if (!session) {
        return null;
    }
    const dao = new UserDAO(session.sub);
    return await dao.getUser();
}

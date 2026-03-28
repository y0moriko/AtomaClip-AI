import prisma from "./prisma";

/**
 * Gets or creates the default "Personal Vault" workspace for a user.
 */
export async function getOrCreatePersonalWorkspace(userId: string, userName: string) {
  // Find a workspace of type "personal" where the user is a member
  const workspaceMember = await prisma.workspaceMember.findFirst({
    where: {
      userId,
      workspace: {
        type: "personal",
      },
    },
    include: {
      workspace: true,
    },
  });

  if (workspaceMember) {
    return workspaceMember.workspace;
  }

  // If none exists, create a new one
  const workspace = await prisma.workspace.create({
    data: {
      name: `${userName}'s Personal Vault`,
      type: "personal",
      members: {
        create: {
          userId,
          role: "owner",
        },
      },
    },
  });

  return workspace;
}

/**
 * Gets all workspaces a user belongs to.
 */
export async function getUserWorkspaces(userId: string) {
  const members = await prisma.workspaceMember.findMany({
    where: { userId },
    include: { workspace: true },
  });
  return members.map((m) => m.workspace);
}

/**
 * Gets all projects in a workspace.
 */
export async function getWorkspaceProjects(workspaceId: string) {
  return await prisma.project.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });
}

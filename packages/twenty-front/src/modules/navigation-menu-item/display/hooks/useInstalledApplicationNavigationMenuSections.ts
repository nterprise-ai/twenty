import { applicationsSelector } from '@/applications/states/applicationsSelector';
import { isTwentyStandardApplication } from '@/applications/utils/isTwentyStandardApplication';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { getInstalledApplicationNavigationMenuSections } from '@/navigation-menu-item/common/utils/getInstalledApplicationNavigationMenuSections';
import { useNavigationMenuItemsData } from '@/navigation-menu-item/display/hooks/useNavigationMenuItemsData';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

// TODO(@thomtrp): remove once IS_CUSTOMIZABLE_SIDEBAR_ENABLED is on for every workspace
export const useInstalledApplicationNavigationMenuSections = () => {
  const { workspaceNavigationMenuItems } = useNavigationMenuItemsData();
  const applications = useAtomStateValue(applicationsSelector);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  return getInstalledApplicationNavigationMenuSections({
    navigationMenuItems: workspaceNavigationMenuItems,
    standardApplicationId: applications.find(isTwentyStandardApplication)?.id,
    workspaceCustomApplicationId:
      currentWorkspace?.workspaceCustomApplication?.id ?? undefined,
  });
};

import { NavigationMenuItemType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { isOwnedByInstalledApplication } from '@/applications/utils/isOwnedByInstalledApplication';
import { type NamedNavigationMenuItem } from '@/navigation-menu-item/common/types/NamedNavigationMenuItem';
import { getNavigationMenuContainersInDisplayOrder } from '@/navigation-menu-item/common/utils/getNavigationMenuContainersInDisplayOrder';
import { isNavigationMenuItemBuiltInSection } from '@/navigation-menu-item/common/utils/isNavigationMenuItemBuiltInSection';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

// TODO(@thomtrp): remove once IS_CUSTOMIZABLE_SIDEBAR_ENABLED is on for every workspace
export const getInstalledApplicationNavigationMenuSections = ({
  navigationMenuItems,
  standardApplicationId,
  workspaceCustomApplicationId,
}: {
  navigationMenuItems: NavigationMenuItem[];
  standardApplicationId: string | undefined;
  workspaceCustomApplicationId: string | undefined;
}): NamedNavigationMenuItem[] => {
  // Without the standard application id its Workspace section can't be told apart.
  if (!isDefined(standardApplicationId)) {
    return [];
  }

  return getNavigationMenuContainersInDisplayOrder({
    navigationMenuItems,
    type: NavigationMenuItemType.SECTION,
    containerId: null,
  }).filter(
    (section) =>
      !isNavigationMenuItemBuiltInSection(section) &&
      section.applicationId !== standardApplicationId &&
      isOwnedByInstalledApplication({
        applicationId: section.applicationId,
        workspaceCustomApplicationId,
      }),
  );
};

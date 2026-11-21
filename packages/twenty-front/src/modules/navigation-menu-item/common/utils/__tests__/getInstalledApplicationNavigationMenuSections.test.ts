import { NavigationMenuItemType } from 'twenty-shared/types';

import { getInstalledApplicationNavigationMenuSections } from '@/navigation-menu-item/common/utils/getInstalledApplicationNavigationMenuSections';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

const STANDARD_APPLICATION_ID = 'standard-application';
const WORKSPACE_CUSTOM_APPLICATION_ID = 'workspace-custom-application';
const INSTALLED_APPLICATION_ID = 'installed-application';

const buildSection = (
  overrides: Partial<NavigationMenuItem>,
): NavigationMenuItem =>
  ({
    id: 'section',
    type: NavigationMenuItemType.SECTION,
    name: 'Section',
    position: 0,
    applicationId: INSTALLED_APPLICATION_ID,
    ...overrides,
  }) as NavigationMenuItem;

describe('getInstalledApplicationNavigationMenuSections', () => {
  it('should return the top-level sections of installed applications by position', () => {
    const sections = getInstalledApplicationNavigationMenuSections({
      navigationMenuItems: [
        buildSection({ id: 'reports', name: 'Reports', position: 2 }),
        buildSection({ id: 'studio', name: 'Studio', position: 1 }),
      ],
      standardApplicationId: STANDARD_APPLICATION_ID,
      workspaceCustomApplicationId: WORKSPACE_CUSTOM_APPLICATION_ID,
    });

    expect(sections.map((section) => section.id)).toEqual([
      'studio',
      'reports',
    ]);
  });

  it('should leave out sections of the standard and workspace custom applications', () => {
    const sections = getInstalledApplicationNavigationMenuSections({
      navigationMenuItems: [
        buildSection({
          id: 'workspace',
          applicationId: STANDARD_APPLICATION_ID,
        }),
        buildSection({
          id: 'custom',
          applicationId: WORKSPACE_CUSTOM_APPLICATION_ID,
        }),
        buildSection({ id: 'studio' }),
      ],
      standardApplicationId: STANDARD_APPLICATION_ID,
      workspaceCustomApplicationId: WORKSPACE_CUSTOM_APPLICATION_ID,
    });

    expect(sections.map((section) => section.id)).toEqual(['studio']);
  });

  it('should leave out nested sections, built-in sections and other item types', () => {
    const sections = getInstalledApplicationNavigationMenuSections({
      navigationMenuItems: [
        buildSection({ id: 'nested', parentId: 'tab' }),
        buildSection({ id: 'built-in', builtInSectionKey: 'favorites' }),
        buildSection({ id: 'folder', type: NavigationMenuItemType.FOLDER }),
        buildSection({ id: 'studio' }),
      ],
      standardApplicationId: STANDARD_APPLICATION_ID,
      workspaceCustomApplicationId: WORKSPACE_CUSTOM_APPLICATION_ID,
    });

    expect(sections.map((section) => section.id)).toEqual(['studio']);
  });

  it('should return nothing until the standard application is known', () => {
    expect(
      getInstalledApplicationNavigationMenuSections({
        navigationMenuItems: [buildSection({ id: 'studio' })],
        standardApplicationId: undefined,
        workspaceCustomApplicationId: WORKSPACE_CUSTOM_APPLICATION_ID,
      }),
    ).toEqual([]);
  });
});

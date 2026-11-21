import { render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { NavigationMenuItemType } from 'twenty-shared/types';

import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { type NamedNavigationMenuItem } from '@/navigation-menu-item/common/types/NamedNavigationMenuItem';
import { NavigationMenuSectionList } from '@/navigation-menu-item/display/containers/components/NavigationMenuSectionList';
import { useInstalledApplicationNavigationMenuSections } from '@/navigation-menu-item/display/hooks/useInstalledApplicationNavigationMenuSections';
import { useWorkspaceNavigationMenuContainers } from '@/navigation-menu-item/display/hooks/useWorkspaceNavigationMenuContainers';

jest.mock(
  '@/navigation-menu-item/display/hooks/useInstalledApplicationNavigationMenuSections',
);
jest.mock(
  '@/navigation-menu-item/display/hooks/useWorkspaceNavigationMenuContainers',
);

let mockIsCustomizableSidebarEnabled = false;

jest.mock('@/workspace/hooks/useIsFeatureEnabled', () => ({
  useIsFeatureEnabled: () => mockIsCustomizableSidebarEnabled,
}));

jest.mock(
  '@/navigation-menu-item/display/containers/components/NavigationMenuSection',
  () => ({
    NavigationMenuSection: ({
      section,
    }: {
      section: Pick<NamedNavigationMenuItem, 'name'>;
    }) => <div>{`Section ${section.name}`}</div>,
  }),
);

jest.mock(
  '@/navigation-menu-item/display/containers/components/NavigationMenuEditableSection',
  () => ({
    NavigationMenuEditableSection: ({
      section,
    }: {
      section: Pick<NamedNavigationMenuItem, 'name'>;
    }) => <div>{`Editable section ${section.name}`}</div>,
  }),
);

jest.mock(
  '@/navigation-menu-item/edit/components/NavigationMenuAddSectionButton',
  () => ({ NavigationMenuAddSectionButton: () => null }),
);

const buildSection = (name: string): NamedNavigationMenuItem => ({
  id: `${name.toLowerCase()}-section-id`,
  type: NavigationMenuItemType.SECTION,
  name,
  position: 0,
  isActive: true,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
});

const renderSectionList = ({
  containerId = null,
  isLayoutCustomizationModeEnabled = false,
}: {
  containerId?: string | null;
  isLayoutCustomizationModeEnabled?: boolean;
} = {}) => {
  const store = createStore();

  store.set(
    isLayoutCustomizationModeEnabledState.atom,
    isLayoutCustomizationModeEnabled,
  );

  render(
    <JotaiProvider store={store}>
      <NavigationMenuSectionList containerId={containerId} />
    </JotaiProvider>,
  );
};

describe('NavigationMenuSectionList', () => {
  beforeEach(() => {
    mockIsCustomizableSidebarEnabled = false;
    jest
      .mocked(useInstalledApplicationNavigationMenuSections)
      .mockReturnValue([buildSection('Studio')]);
    jest
      .mocked(useWorkspaceNavigationMenuContainers)
      .mockReturnValue([buildSection('Sales')]);
  });

  describe('when the customizable sidebar is off', () => {
    it('shows the sections of installed applications on Home', () => {
      renderSectionList();

      expect(screen.getByText('Section Studio')).toBeVisible();
      expect(screen.queryByText('Section Sales')).not.toBeInTheDocument();
    });

    it('keeps them read-only while the layout is being customized', () => {
      renderSectionList({ isLayoutCustomizationModeEnabled: true });

      expect(screen.getByText('Section Studio')).toBeVisible();
      expect(
        screen.queryByText('Editable section Studio'),
      ).not.toBeInTheDocument();
    });

    it('shows nothing inside a tab', () => {
      renderSectionList({ containerId: 'tab-id' });

      expect(screen.queryByText('Section Studio')).not.toBeInTheDocument();
    });
  });

  describe('when the customizable sidebar is on', () => {
    beforeEach(() => {
      mockIsCustomizableSidebarEnabled = true;
    });

    it('shows every section of the container', () => {
      renderSectionList();

      expect(screen.getByText('Section Sales')).toBeVisible();
      expect(screen.queryByText('Section Studio')).not.toBeInTheDocument();
    });

    it('makes the sections editable while the layout is being customized', () => {
      renderSectionList({ isLayoutCustomizationModeEnabled: true });

      expect(screen.getByText('Editable section Sales')).toBeVisible();
    });
  });
});

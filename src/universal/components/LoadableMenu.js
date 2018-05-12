import React from 'react';
import ui from 'universal/styles/ui';
import AnimatedFade from 'universal/components/AnimatedFade';
import styled from 'react-emotion';

import type {WithCoordsProps} from 'universal/decorators/withCoordsV2';
import withCoordsV2 from 'universal/decorators/withCoordsV2';
import Modal from 'universal/components/Modal';
import type {ToggledPortalProps} from 'universal/decorators/withToggledPortal';
import withToggledPortal from 'universal/decorators/withToggledPortal';

const MenuBlock = styled('div')({
  padding: '.25rem 0',
  position: 'absolute',
  zIndex: ui.ziMenu
});

const MenuContents = styled('div')({
  backgroundColor: ui.menuBackgroundColor,
  borderRadius: ui.menuBorderRadius,
  boxShadow: ui.menuBoxShadow,
  outline: 0,
  overflowY: 'auto',
  paddingBottom: ui.menuGutterVertical,
  paddingTop: ui.menuGutterVertical,
  textAlign: 'left',
  width: '100%'
});

type Props = {
  LoadableComponent: React.Component,
  queryVars?: Object,
  ...ToggledPortalProps,
  ...WithCoordsProps
};

const LoadableMenu = (props: Props) => {
  const {
    closePortal,
    coords,
    isClosing,
    isOpen,
    maxHeight,
    maxWidth,
    setModalRef,
    LoadableComponent,
    queryVars,
    terminatePortal
  } = props;
  return (
    <Modal clickToClose escToClose onClose={closePortal} isOpen={isOpen}>
      <AnimatedFade appear duration={100} slide={32} in={!isClosing} onExited={terminatePortal}>
        <MenuBlock style={{...coords, maxWidth}} innerRef={setModalRef}>
          <MenuContents style={{maxHeight}}>
            <LoadableComponent {...queryVars} closePortal={closePortal} />
          </MenuContents>
        </MenuBlock>
      </AnimatedFade>
    </Modal>
  );
};

export default withCoordsV2(withToggledPortal(LoadableMenu));

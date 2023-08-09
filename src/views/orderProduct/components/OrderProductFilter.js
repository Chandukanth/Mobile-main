import React from 'react';

import BottomDrawer from "../../../components/BottomDrawer";

const FilterDrawer = ({ isOpen, onClose }) => {

  return (
    <>
      <BottomDrawer isOpen={isOpen} onClose={onClose} title={"Order Filter"}>

      </BottomDrawer>
    </>
  )
};

export default FilterDrawer;
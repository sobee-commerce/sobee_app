import {BottomTabs} from '@/navigators';
import {ApplicationScreenProps} from '@/types';
import React, {useEffect} from 'react';

const MainScreen = (props: ApplicationScreenProps<'Main'>) => {
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, [props.navigation]);
  return (
    <>
      <BottomTabs {...props} />
    </>
  );
};

export default MainScreen;

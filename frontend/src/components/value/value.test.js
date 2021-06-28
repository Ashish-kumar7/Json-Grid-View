import React from 'react';
import Value from './Value';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<Value />);
});

it('should return a <span>', () => {
    expect(shallowWrapper.type()).toEqual('span');
});


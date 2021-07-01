import React from 'react';
import Footer from './footer';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<Footer />);
});

it('should return a <div>', () => {
    expect(shallowWrapper.type()).toEqual('div');
});

// Find the text of <p> element
it('able to find the text of <p> element ', () => {
    expect(shallowWrapper.find('p').text()).toEqual('Copy021.');
})
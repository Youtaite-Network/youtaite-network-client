import React from 'react';

function About() {
  return (
    <div className="container mt-3">
      <h2>What&apos;s this?</h2>
      <h3>What is Youtaite Network?</h3>
      {/* eslint-disable-next-line max-len */}
      <p>The purpose of Youtaite Network is to show how different collaborations within the youtaite community are connected to each other through people. For example, if you are in two different collabs, those two collabs are connected through you. I hope to visualize the &quot;shape&quot; of the community with its different subgroups, formed either through music genres (such as idol music, vocaloid, or J-rock) or close friend groups. In the future, you will be able to restrict the network further by showing only collabs that were posted within a certain time range, showing how the community has morphed over time.</p>
      <h3>Technical Description</h3>
      <p>
        A detailed technical description of the website can be found
        {' '}
        <a href="https://eberleant.github.io/youtaite-network-client">here</a>
        .
      </p>
      <h3>Report a bug, feature request, data correction, or more</h3>
      <p>
        Please use this
        {' '}
        <a href="https://forms.gle/UGtsik9jtQW448bj8">Google Form</a>
        {' '}
        to report anything you find!
      </p>
      <h3>Contact me</h3>
      <ul>
        <li>lyn.youtaite@gmail.com</li>
        <li><a href="https://twitter.com/lynsings">Twitter</a></li>
        <li><a href="https://youtube.com/lynsings">Youtube</a></li>
      </ul>
    </div>
  );
}

export default About;

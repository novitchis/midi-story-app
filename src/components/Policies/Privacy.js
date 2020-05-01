import React from 'react';
import { Typography, Link } from '@material-ui/core';

const Privacy = () => {
  return (
    <div>
      <p>Last updated: May 01, 2020</p>
      <br />
      <Typography variant="h5" color="secondary">
        Introduction
      </Typography>
      <Typography>
        Midistory is a platform for creating beautifull videos for midi files.
        "We", "us" or "our" refers to the Midistory platform in this Privacy
        Policy.
      </Typography>
      <Typography>
        This Privacy Policy applies whenever you use any of the services,
        products or content that Midistory provides.
      </Typography>
      <br />
      <Typography>This Privacy Policy Describes:</Typography>
      <ul>
        <li>
          <Typography>What information we collect and why</Typography>
        </li>
        <li>
          <Typography>How we use your personal information</Typography>
        </li>
        <li>
          <Typography>
            How changes will be made to this Privacy Policy
          </Typography>
        </li>
        <li>
          <Typography>What are the methods of contacting us</Typography>
        </li>
      </ul>
      <Typography>
        If you do not want Midistory to collect, store or share your information
        in the ways described in this Privacy Policy you may not use Midistory
        services.
      </Typography>
      <br />
      <Typography variant="h5" color="secondary">
        1. Information We Collect
      </Typography>
      <Typography>We collect the folowing types of information:</Typography>
      <ul>
        <li>
          <Typography>
            Information you provide to Us directly including your name, email
            address and a password.
            <br />
            <Typography>
              To create an account you provide data including your name, email
              address, password and profile picture. The same data is provided
              when connecting with Facebook or Google accounts.
            </Typography>
          </Typography>
        </li>
        <li>
          <Typography>
            Anonymous information collected automatically - these may include
            visited pages, time spent on each page, name, size and format of the
            files used in your projects.
            <br />
            <Typography>
              When you use or interact with our Site and Services, we use Google
              Analytics to collect anonymous usage data.
            </Typography>
          </Typography>
        </li>
      </ul>
      <br />
      <Typography variant="h5" color="secondary">
        2. Use Of Your Personal Information
      </Typography>
      <Typography>We use your personal information to:</Typography>
      <ul>
        <li>
          <Typography>Provide Midistory services to you.</Typography>
        </li>
        <li>
          <Typography>
            Gain insights and improve the functionality of our website.
          </Typography>
        </li>
      </ul>
      <br />
      <Typography variant="h5" color="secondary">
        3. Children Under The Age Of 13
      </Typography>
      <Typography>
        Our website is not intended for children under 13 years of age. We do
        not knowingly collect personal information from children under 13. If
        you are under 13, please do not provide any information on this Website.
      </Typography>
      <br />
      <Typography variant="h5" color="secondary">
        4. Mailing Policy
      </Typography>
      <Typography>
        When we receive an email from you, we use your email address and any
        other information you give us to provide you with the information or
        other services that you requested.
        <br />
        We will never use your email address or other information to provide you
        with any unsolicited messages or information (unless that is part of the
        service you are requesting or core Midistory functionality), nor will we
        share it with 3rd parties.
      </Typography>
      <br />
      <Typography variant="h5" color="secondary">
        5. Future Changes To Privacy Policy
      </Typography>
      <Typography>
        We may revise this Privacy Policy from time to time to reflect changes
        to our platform, the Sites or Services, or applicable laws. The revised
        Privacy Statement will be effective as of the published effective date.
        If the revised version includes a substantial change, we will provide
        you with 30 days prior notice by posting notice of the change on the
        "Privacy Policy" page of our website. We also may notify Users of the
        change using email or other means.
      </Typography>
      <br />
      <Typography variant="h5" color="secondary">
        6. Contact Information
      </Typography>
      <Typography>
        You can contact us at{' '}
        <Link href="mailto:support@midistory.com">support@midistory.com</Link>
      </Typography>
      <br />
    </div>
  );
};

export default Privacy;

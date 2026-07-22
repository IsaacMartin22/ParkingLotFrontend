import React, {JSX} from 'react';
import AppFooter from '../../components/AppFooter';
import ServiceHeader from '../../components/ServiceHeader';
import '../../styles/ServicePageStyles.css';
import { SDK_GITHUB } from "../../types/constants";

function SDK(): JSX.Element {
  return (
    <>
      <ServiceHeader
        title="SDK Dashboard"
        subtitle="No diagnostics for SDK. Visit GitHub to clone and use the published SDK for the API."
        actionLink={{
          analyticsId: 'sdk-github-link',
          href: SDK_GITHUB,
          label: 'Clone the SDK ↗',
        }}
      />
      <main className="service-container">
        <div className="service-details">
          <h3>Overview</h3>
          <p>
            SDKs are not hosted, there are no diagnostics. It is intended to be cloned and run locally.
            Visit GitHub to clone and use the SDK. Or if you already have a Maven project you want to
            include the SDK in, add the following to your pom.xml file.
          </p>
          <pre className="service-code-block">
            <code>{`<dependency>
  <groupId>io.github.isaacmartin22</groupId>
  <artifactId>parking-lot-api-sdk</artifactId>
  <version>0.0.16</version>
</dependency>`}</code>
          </pre>
        </div>
      </main>
      <AppFooter />
    </>
  );
}

export default SDK;

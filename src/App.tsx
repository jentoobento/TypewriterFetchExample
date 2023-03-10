import { useEffect, useState } from 'react';
import './App.css';
import AnimatedText from './AnimatedText';

const sectionRegex = new RegExp(/^11/);
const mainRegex = new RegExp(/.*22/);
const articleRegex = new RegExp(/.*33*./);

const HTML_WITH_HIDDEN_URL = 'https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge';

function App() {
  const [hiddenUrl, setHiddenUrl] = useState<string>('');
  const [hiddenWord, setHiddenWord] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const displayErr = (e: Error) => {
    console.log('Error:', e);
    setLoading(false);
    setError(true);
  }

  // Get the hidden url using the given url.
  useEffect(() => {
    fetch(HTML_WITH_HIDDEN_URL).then((response) => {
      return response.text();
    }).then((htmlTextStr) => {
      let secretUrl = '';

      const doc = new DOMParser().parseFromString(htmlTextStr, 'text/html');

      // Get all <section> tags, ignore everything else
      const sections = doc.getElementsByTagName("section");

      for (const section of sections) {
        const id = section.id;
        // Test the section's id, ignore if invalid
        if (sectionRegex.test(id)) {
          // Get all <main> tags that are children of <section>
          for (const sectionChild of section.children) {
            const sectionChildId = sectionChild.id;

            // Test the <main> id, ignore if invalid
            if (sectionChild.tagName.toLowerCase() === "main" && mainRegex.test(sectionChildId)) {
              // Get all <article> tags that are children of <main>
              for (const mainChild of sectionChild.children) {
                const mainChildId = mainChild.id;

                // Test the <article> id, ignore if invalid
                if (mainChild.tagName.toLowerCase() === "article" && articleRegex.test(mainChildId)) {
                  // Get all <p> tags that are children of <article>
                  for (const articleChild of mainChild.children) {
                    // Look for <p>
                    if (articleChild.tagName.toLowerCase() === "p") {
                      secretUrl += articleChild.getAttribute('value');
                    }
                  }
                }
              }
            }
          }
        }
      }

      console.log(secretUrl);
      setHiddenUrl(secretUrl);
    }).catch((e) => {
      displayErr(e);
    });
  }, []);

  // Get the hidden word using the hidden url.
  useEffect(() => {
    if (hiddenUrl) {
      fetch(hiddenUrl).then((response) => {
        return response.text();
      }).then((htmlTextStr) => {
        setHiddenWord(htmlTextStr);
        setLoading(false);
      }).catch((e) => {
        displayErr(e);
      })
    }
  }, [hiddenUrl]);

  return (
    <div className="App">
      <header className="App-header">
        {loading ? (
          <p>Loading...</p>
        ) : null}
        {error ? (
          <p>Sorry an error occured.</p>
        ) : null}
        {hiddenWord ? (
          <AnimatedText text={hiddenWord} />
        ) : null}
      </header>
    </div>
  );
}

export default App;

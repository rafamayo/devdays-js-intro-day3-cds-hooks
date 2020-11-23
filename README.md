# CDS Hooks

We have two apps today, (1) the React app and (2) a new express app to be our
CDS Hooks service.

1. If you want, you can use your own React app from yesterday, or here is one
   you can use if you prefer:

- https://codesandbox.io/s/fhir-dev-days-react-day3-starting-jj5gz

2. The starter for the CDS Hooks service for today (e.g. this project) is:

- https://codesandbox.io/s/dev-days-cds-hooks-example-fzdn2

We will review how CDS Hooks works, and will build a decision support service
to return cards based on the patient's daily step status.

# Setup Tips

## Deploying to Netlify (React App)

We need to deploy our react app to Netlify. This is a three step process the
first time:

1. To do this you will need to click on the rocket ship on the left of
   codesandbox (for deployments), and press "Deploy to Netlify". After a few
   minutes you will see an id string above a "Visit Site", "Claim Site" and
   "View Logs". This is your Netlify site.
2. Edit the public/launch.html page, an update the setting for `redirectUri`.
   This should include that Netlify id, for example
   `https://csb-jj6gz.netlify.app`.
3. Re-deploy to Netlify (to deploy this change).

If you make changes, you will need to manually re-deploy to Netlify, it doesn't
autodeploy.

## Data Setup

In this project, there is a script called backfill.js. Feel free to edit it to
update the patient name, goal, etc. This will build some data for you, so after
you run it keep track of the patient ID it created.

To run this, pen a terminal on the right, and:

```
> source node-shortcut.js
> node backfill.js
```

## CDS Hooks Setup

We will be trying the app over at CDS Hooks sandbox,
https://sandbox.cds-hooks.org.

1. Change the FHIR Server to the one we have been using. Click the gear icon on
   the top right, and click "Change FHIR Server". Make sure to use the
   "protected" one we have been using, which is
   `https://launch.smarthealthit.org/v/r4/fhir`.
2. In the same gear icon menu, click "Change Patient" and paste in the patient
   ID from the step before.

Now after you get your CDS Hooks service discover endpoint built, we will go
back here and click "Add CDS Service". Enter in the codesandbox URL followed by
`/cds-services`.

---

## WARNING: SPOILERS BELOW

1. Implement your service (prefetch) in `controllers/services.js`, maybe
   something like this:

```
  patient: 'Patient/{{context.patientId}}',
  lastStepBundle: 'Observation?subject={{context.patientId}}&code=http://loinc.org|41950-7&_sort=-date&_count=1'
```

2. Implement your decision support logic in `controllers/steps.js`, maybe
   something like this:

```
  if (lastStep && isToday(new Date(lastStep.effectiveDateTime))) {
    // We have steps recorded, send back status...
    return [
      {
        uuid: uuidv4(),
        summary: 'Steps were recorded today!',
        indicator: 'info',
        detail: `Logged *${lastStep.valueInteger}* steps for ${patient.name[0].given}. Great work!`,
        source: {
          label: 'Steptracker 2000'
        }
      }
    ]
  } else {
    // We need to record today's steps, there isn't one
    return [
      {
        uuid: uuidv4(),
        summary: 'Oops, no steps recorded for today!',
        indicator: 'warning',
        detail: `No steps for ${patient.name[0].given}. You can launch the _SMART app_ with the link below.`,
        source: {
          label: 'Steptracker 2000'
        },
        links: [
          {
            label: 'Record steps for today',
            url: 'https://csb-jj5gz.netlify.app/launch.html',
            type: 'smart'
          }
        ]
      }
    ]
  }
```

3. Seeing that we are using our authenticateClient middleware, we have access to
   an authenticated fhirclient (in `controllers/steps.js`). Try to do a request
   for something that wasn't specified in the prefetch!

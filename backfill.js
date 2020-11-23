import FHIR from "fhirclient";

const client = new FHIR().client({ serverUrl: "https://r4.smarthealthit.org" });

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const observationEntries = [];

for (let step = 1; step < 30; step++) {
  const effectiveDateTime = new Date();
  effectiveDateTime.setDate(effectiveDateTime.getDate() - step);

  const valueInteger = randomIntFromInterval(1000, 10000);

  observationEntries.push({
    fullUrl: `http://acme.com/Observation/observation-${step}`,
    resource: {
      resourceType: "Observation",
      status: "final",
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "41950-7"
          }
        ]
      },
      subject: {
        reference: `Patient/patient-1`
      },
      effectiveDateTime,
      valueInteger
    },
    request: {
      method: "POST",
      url: "/Observation"
    }
  });
}

const bundle = {
  resourceType: "Bundle",
  type: "transaction",
  entry: [
    observationEntries,
    {
      fullUrl: "http://acme.com/fhir/Goal/goal-1",
      resource: {
        resourceType: "Goal",
        description: {
          text: "Steps goal."
        },
        lifecycleStatus: "active",
        target: [
          {
            measure: {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "41950-7",
                  display: "Number of steps in 24 hour Measured"
                }
              ]
            },
            detailInteger: 5000,
            dueDate: "2020-12-25"
          }
        ],
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/goal-category",
                code: "physiotherapy"
              }
            ]
          }
        ],
        subject: {
          reference: `Patient/patient-1`
        },
        startDate: new Date()
      },
      request: {
        method: "POST",
        url: "/Goal"
      }
    },
    {
      fullUrl: "http://acme.com/Patient/patient-1",
      resource: {
        resourceType: "Patient",
        name: [
          {
            given: "Pat",
            family: "McAcme"
          }
        ]
      },
      request: {
        method: "POST",
        url: "/Patient"
      }
    }
  ]
};

client
  .request({
    url: `/`,
    method: "POST",
    headers: { "Content-Type": "application/json+fhir" },
    body: JSON.stringify(bundle)
  })
  .then((r) => console.dir(JSON.stringify(r, null, 2)))
  .catch((e) => console.error(e));

# Choosing Neptune's Query Model

```
                   +-------------------------------------------------+
                   |           Amazon Neptune Graph Engine           |
                   +-------------------------------------------------+
                                            |
                  +-------------------------+-------------------------+
                  |                                                   |
                  v                                                   v
      [ Property Graph (PG) Engine ]                      [ RDF / Semantic Engine ]
  - Nodes, Edges, Properties (Key-Value)             - Triples / Quads (Subject, Predicate,
  - Internal Data Types (String, Int, Float)           Object, Graph IRI)
  - Interoperable: Shared Labeled Data               - Universal Identifiers (URIs / IRIs)
                  |                                                   |
         +--------+--------+                                          |
         |                 |                                          v
         v                 v                                    [ SPARQL 1.1 ]
    [ Gremlin ]      [ openCypher ]                         - Standardized W3C Query
  - Functional       - Declarative                          - Ontological Reasoning
  - Traversal        - Pattern Matching                     - Semantic Web Integration
```

## Choosing the Appropriate Model

```
                               Start Decision Tree
                                        |
                 Is global data federation / W3C ontology compliance
                 or external linked open data required?
                                        |
                       +----------------+----------------+
                       |                                 |
                      YES                                NO
                       |                                 |
                       v                                 v
               [ Choose RDF / SPARQL ]         [ Choose Property Graph ]
               - Uses W3C Triples              - High-performance OLTP
               - Ontological inferencing       - Rich node/edge properties
               - Global IRIs                   - Flexible language selection
                                                         |
                                        +----------------+----------------+
                                        |                                 |
                          Developer Team Preference:        Developer Team Preference:
                          Declarative / SQL-like            Functional / Explicit Path
                                        |                                 |
                                        v                                 v
                               [ Choose openCypher ]             [ Choose Gremlin ]
```

1. Choose Property Graph (Gremlin or openCypher) when:
    - Focus is Application-Centric OLTP. Building real-time interactive applications (e.g., identity graphs, fraud detection, recommendation engines) where operations modify properties on nodes and edges with single-digit millisecond responses.
    - Edge Attributes are Critical. Relationships contain rich metadata properties (e.g., `weight`, `timestamp`, `access_count`, `transaction_id`).
    - Team Skillset: Development team is familiar with procedural language bindings (Java/Python SDKs via Gremlin) or standard declarative SQL-style syntaxes (openCypher).

2. Choose RDF (SPARQL) when:
    - Enterprise Semantic Standardization: Constructing enterprise knowledge graphs, vocabulary schemas, or taxonomy structures governed by W3C standards (OWL, SKOS, RDFS).
    - Data Integration Across Domains: There is need to federate data across external datasets or public sources (e.g., Wikidata, UniProt, DBpedia) using standardized global IRIs.
    - Inferencing & Reasoning Requirements.
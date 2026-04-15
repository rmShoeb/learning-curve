import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Link } from '@app/core/models/link.model';

@Component({
    selector: 'app-doc-home',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './doc-home.component.html',
    styleUrl: './doc-home.component.css'
})
export class DocHomeComponent {
    quickLinks: Link[];

    constructor() {
        this.quickLinks = [
            {
                routerLink: "/Cloud",
                text: "Cloud Computing",
                children: [
                    { routerLink: '/Cloud/AWS/intro', text: 'Amazon Web Services' },
                    // { routerLink: '/Cloud/sql-server', text: 'Google Cloud Platform' },
                    // { routerLink: '/Cloud/mysql', text: 'Microsoft Azure' },
                ]
            },
            {
                routerLink: "/database",
                text: "Database",
                children: [
                    { routerLink: '/Database/RDBMS/01-intro', text: 'Relational Database Management System' },
                    { routerLink: '/database/mysql/01-intro', text: 'MySQL' },
                    { routerLink: '/Database/sql-server', text: 'SQL Server' },
                    { routerLink: '/Database/database-migration/0-intro', text: 'Database Migration' },
                ]
            },
            {
                routerLink: "/framework",
                text: "Frameworks",
                children: [
                    { routerLink: '/Framework/Angular/01-architecture', text: 'Angular' },
                    { routerLink: '/Framework/angularjs', text: 'AngularJS' },
                    { routerLink: '/Framework/Hibernate/01-intro', text: 'Hibernate' },
                    { routerLink: '/Framework/junit', text: 'JUnit' },
                    { routerLink: '/Framework/mockito', text: 'Mockito' },
                    { routerLink: '/Framework/RxJS/intro', text: 'RxJS' },
                    { routerLink: '/Framework/Spring Framework/intro', text: 'Spring Framework' },
                ]
            },
            {
                routerLink: "/programming-language",
                text: "Programming Languages",
                children: [
                    { routerLink: '/Programming Language/csharp', text: 'C#' },
                    { routerLink: '/Programming Language/CPP/01-intro', text: 'C++' },
                    { routerLink: '/Programming Language/Java/00-introduction', text: 'Java' },
                    { routerLink: '/Programming Language/javascript', text: 'JavaScript' },
                    { routerLink: '/Programming Language/typescript', text: 'TypeScript' },
                ]
            },
            {
                routerLink: "/tools",
                text: "Tools",
                children: [
                    { routerLink: '/Tools/git', text: 'Git' },
                    { routerLink: '/Tools/maven', text: 'Maven' },
                    { routerLink: '/Tools/npm', text: 'Node Package Manager' },
                ]
            },
            {
                routerLink: "/others",
                text: "Others",
                children: [
                    { routerLink: '/Others/automation/0-intro', text: 'CI/CD' },
                    { routerLink: '/Others/design-principles-patterns', text: 'Design Principles & Patterns' },
                    { routerLink: '/Others/rest-api-conventions', text: 'REST API Conventions' },
                    { routerLink: '/Others/System Design/intro', text: 'System Design' },
                ]
            }
        ];
    }
}

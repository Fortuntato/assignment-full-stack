# Stotles work sample assignment

## Getting started

This sample codebase consists of a separate client & server code.

It's set up in a simple way to make it as easy as possible to start making changes,
the only requirement is having recent versions of `node` & `npm` installed.

This is not a production ready configuration (nor production ready code),
it's only set up for easy development, including live reload.

To run the client bundler:

```
cd client
npm install
npm run dev
```

The processed code will be available at http://localhost:3001

To start the server:

```
cd server
npm install
npm run dev
```

The server will be available at http://localhost:3000 - the page is automatically configured
to use the assets served by vite on port 3001.

You should see something similar to this page:

![Search page](./screenshot.png)

### Disabling/Enabling TypeScript

If you prefer to completely disable TypeScript for a file, add `// @ts-nocheck` on the first line.
If on the other hand you'd like to enable strict type checking, modify `tsconfig.json` according to your needs.

Note that you can import plain JavaScript files that won't be fully typechecked.

### Browsing the database

You should start by looking at the migration in `./migrations` folder.
If you prefer to browse the DB using SQL, you can use the sqlite command line (just run `sqlite3 ./db.sqlite3`)
or any other SQL client that supports sqlite.

If for any reason the database becomes unusable, you can rebuild it using `./reset_db.sh` script`.

## The task

All the instructions are available [here](https://www.notion.so/stotles/Full-stack-software-engineer-work-sample-assignment-ae7c64e08f2a42a097d16cee4bc661fc).


## Comments by Shouyi
The documentation to get the project setup was very clear. There was only one error in the build of the application initially that was unexpected. The code was complaining for a missing package that I had to install by running this additional command: 
npm install --save reflect-metadata rxjs

#Warm up exercises
In the warm up exercise for the implementation of the "stage" column, the description mentions "type" column from the  table in the database but there is no such column. Given the data expected, I supposed "type" is referring to "stage" instead.

For the same task, the case of "TenderIntent" was not accepted as a value so I've added it in the ProcurementRecord model because I assume you wanted to include all the existing cases from the database. I'm considering "TenderIntent" as a case of "Tender".

-> From the task description: “Open until {close_date}” if close date is null or close date is in the future 
There could be a case of null date or invalid date to be shown in the frontend. For now I left it as per requirement. But please check the comment in RecordsTable.tsx on line 74

#Main task
Given that I don't work with React and that I have no prior knowledge about Ant Design, I've spent some time reading up about Ant's documentation and the other links you have put in the task description. My final solution for the task, is based upon the example given in the documentation for the filters in the table (i.e. https://ant.design/components/table/?theme=dark#components-table-demo-filter-search).

#Possible improvements with more time
- Show the filter dropdown width smaller. I've noticed that even if declare the width size in RecordsTable.tsx on line 65, it's not being applied because the name of a buyer is very long (i.e "NHS Supply Chain – Hotel Services Operating as North of England Commercial Procurement Collabrative (NoECPC) (who are hosted by Leeds and York Partnership NHS Foundation Trust) acting on behalf of Supply Chain Coordination Ltd"). 
- Adjust the filter popup when start to search. At the moment if the user searches for an option (e.g. Searching "Leido") it's possible that the popup becomes smaller and it moves to the left).


#Senior Developers candidates answer
In the scenario where there is a lot of data to be taken into account here there are some consideration and solution I was thinking:
- Implement paging for the results. Which allows the data in the table to be rendered in smaller sets. 
- Similar to above, implement an "infinite scroll" which calls an API to retrieve the next set of data only when the user reaches the end of the current results.

Additional features and considerations:
- Create a separated filter menu option which allows to filter by all the columns (e.g. Published date range, closing date range, value range or value currency).
- Automatically order the results by one or more columns (e.g. Order by published date first and then by buyer name alphabetically)
- When searching by the title or description, still include all the existing filters applied.
- Differentiate the search box to know if it refers to the title, description or another column.
- Show currency symbol next to the currency code and show on hover a current conversion to the preferred currency (e.g. User works in GBP but the tender contract is in EUR, when the user hover on the currency, show the current conversion to GBP).
- Maybe show the filter menu option on the right panel under the "Procurement search" label.
- Create a clear all filters button.

#Code improvements
- Find a better way to convert the list of buyers to show in the filter options (line 20 RecordsTable.tsx).
- Move logic of text to display for the Stage column into a function in case it's used somewhere else (lines 72-80 RecordsTable.tsx).
- Create a "helper" function that takes the string date and formats it to the standard date format required.
- Create an "SQL helper" or similar that stores all the queries statement (e.g. enumeration) and performs the sequelize.query function.
- Create a log system with all the expected error messages (e.g. enumeration) that stores them somewhere in a separate database or table.
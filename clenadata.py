from unittest import result
import pandas as pd # Import the library
import numpy as np

# Read a comma-separated values (csv) file into DataFrame.
bestseller_df = pd.read_csv("Project/Books_df.csv", encoding = 'latin1', delimiter=',')
generalbooklist_df = pd.read_csv("Project/books_1.Best_Books_Ever.csv", encoding = 'utf-8', delimiter=',')
new_bestseller_list = pd.read_csv("Project/amazon_bs_20102020.csv", encoding = 'utf-8', delimiter=',')

#bestseller_df.dropna(subset = ["Title"], inplace=True)
#generalbooklist_df.dropna(subset = ["title"], inplace=True)
#generalbooklist_df.dropna(subset = ["author"], inplace=True)
#generalbooklist_df.dropna(subset = ["price"], inplace=True)

# Sort and remove duplicates while keeping the first record.
generalbooklist_df.sort_values("title", inplace = True)
#generalbooklist_df.drop_duplicates(subset ="title", keep = 'first', inplace = True)

bestseller_df.sort_values("Title", inplace = True)
#bestseller_df.drop_duplicates(subset ="Title", keep = 'first', inplace = True)

new_bestseller_list.sort_values("Book_Title", inplace=True)



generalbooklist_df.drop(['bookId', 'description', 'isbn', 'characters', 'firstPublishDate', 'bbeScore', 'bbeVotes', 'coverImg'], axis = 1, inplace=True)

#generalbooklist_df['title'] = generalbooklist_df['title'].str.encode('windows-1252').str.decode('utf8')

#generalbooklist_df["isBestSeller"] = generalbooklist_df['title'].map(bestseller_df.set_index('Title')['True'])

#print(bestseller_df.count)

results = pd.merge(generalbooklist_df, new_bestseller_list, how="inner", left_on='title', right_on='Book_Title')
results.drop_duplicates(subset ="title", keep = 'first', inplace = True)

print(results.head)

#print(results.head())
#print(bestseller_df.head())

generalbooklist_df.to_csv('Project/finalData.csv', index = False, header = True)

results.to_csv('Project/merge.csv', index = False, header = True)

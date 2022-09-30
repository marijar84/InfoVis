from unittest import result
import pandas as pd # Import the library
import numpy as np

#FIXME: clean up!
#TODO: series -> sentinel values

# Read a comma-separated values (csv) file into DataFrame.
#bestseller_df = pd.read_csv("Books_df.csv", encoding = 'latin1', delimiter=',')
generalbooklist_df = pd.read_csv("books_1.Best_Books_Ever.csv", encoding = 'utf-8', delimiter=',')
new_bestseller_list = pd.read_csv("amazon_bs_20102020.csv", encoding = 'utf-8', delimiter=',')

generalbooklist_df.dropna(subset = ["title"], inplace=True)
generalbooklist_df.dropna(subset = ["author"], inplace=True)

# Sort and remove duplicates while keeping the first record.
#generalbooklist_df.sort_values("title", inplace = True)
#generalbooklist_df.drop_duplicates(subset ="title", keep = 'first', inplace = True)

#bestseller_df.sort_values("Title", inplace = True)
#bestseller_df.drop_duplicates(subset ="Title", keep = 'first', inplace = True)

#new_bestseller_list.sort_values("Book_Title", inplace=True)



generalbooklist_df.drop(['bookId', 'author', 'description', 'edition', 'isbn', 'characters', 'firstPublishDate', 'publishDate', 'bbeScore', 'bbeVotes', 'coverImg', 'price'], axis = 1, inplace=True)

#generalbooklist_df['title'] = generalbooklist_df['title'].str.encode('windows-1252').str.decode('utf8')

#generalbooklist_df["isBestSeller"] = generalbooklist_df['title'].map(bestseller_df.set_index('Title')['True'])

#print(bestseller_df.count)

results = pd.merge(generalbooklist_df, new_bestseller_list, how="inner", left_on='title', right_on='Book_Title', sort = True)
results.drop_duplicates(subset ="title", keep = 'first', inplace = True)
results.drop(['Book_Title', 'Rank'], axis = 1, inplace=True)

#print(results.head)

#print(results.head())
#print(bestseller_df.head())

generalbooklist_df.to_csv('finalData.csv', index = False, header = True)

results.to_csv('merge.csv', index = False, header = True)
print(results.count())
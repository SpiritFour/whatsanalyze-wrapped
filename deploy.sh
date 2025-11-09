# Local build, move to /docs to be able to deploy in same branch

if [ -z statusResult ]
then
   echo 'Git clean, continue...'
else
   echo 'Git not clean, ending..!'
  exit;
fi

echo "Starting Deploy"
cd frontend

rm -r .output
NUXT_APP_BASE_URL=/whatsanalyze-wrapped/ pnpx nuxt build --preset github_pages

cd ..

rm -r docs
mv frontend/.output/public docs

rm -r frontend/.output

echo "Please commit and push now"

git add .

git commit -m "deploy"

git push
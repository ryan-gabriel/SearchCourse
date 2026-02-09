
$baseUrl = "http://localhost:3001/api/admin"

Write-Host "--- Test 1: Get a Course ID ---"
try {
    $courses = Invoke-RestMethod -Uri "$baseUrl/courses?limit=1" -Method Get
    if ($courses.data.Count -eq 0) {
        Write-Host "No courses found. Cannot test roadmap steps."
        exit
    }
    $courseId = $courses.data[0].id
    Write-Host "Using Course ID: $courseId"
} catch {
    Write-Host "Error fetching courses: $_"
    exit
}

Write-Host "`n--- Test 2: Create Roadmap ---"
$newRoadmap = @{
    title = "Test Roadmap"
    slug = "test-roadmap-$(Get-Random)"
    description = "Test Description"
    isActive = $true
} | ConvertTo-Json

try {
    $roadmap = Invoke-RestMethod -Uri "$baseUrl/roadmaps" -Method Post -Body $newRoadmap -ContentType "application/json"
    Write-Host "Success! Created roadmap with ID: $($roadmap.id)"
} catch {
    Write-Host "Error creating roadmap: $_"
    exit
}

Write-Host "`n--- Test 3: Add Step to Roadmap ---"
$newStep = @{
    courseId = $courseId
    title = "Step 1"
    description = "First step"
    orderIndex = 0
} | ConvertTo-Json

try {
    $step = Invoke-RestMethod -Uri "$baseUrl/roadmaps/$($roadmap.id)/steps" -Method Post -Body $newStep -ContentType "application/json"
    Write-Host "Success! Added step with ID: $($step.id)"
} catch {
    Write-Host "Error adding step: $_"
}

Write-Host "`n--- Test 4: Get Roadmap Details ---"
try {
    $details = Invoke-RestMethod -Uri "$baseUrl/roadmaps/$($roadmap.id)" -Method Get
    Write-Host "Retrieved roadmap details."
    Write-Host "Step Count: $($details.steps.Count)"
    if ($details.steps.Count -eq 1) {
        Write-Host "Verification Passed: Step count matches."
    } else {
        Write-Host "Verification Failed: Step count mismatch."
    }
} catch {
    Write-Host "Error getting details: $_"
}

Write-Host "`n--- Test 5: Delete Roadmap ---"
try {
    $deleted = Invoke-RestMethod -Uri "$baseUrl/roadmaps/$($roadmap.id)" -Method Delete
    Write-Host "Success! Deleted roadmap."
} catch {
    Write-Host "Error deleting roadmap: $_"
}
